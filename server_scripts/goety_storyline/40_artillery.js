(function () {
// ============================================================
//  炮兵仆从 / 敌对炮兵
//  己方：绑定装有火药+炮弹的木桶 + Supplementaries 大炮
//  敌对：生成时绑定最近炮位，炸弹 + 4 火药等级，无限弹药
//  自卫：农夫乐事铁刀（由 goety 近战 AI 处理）
// ============================================================

const $WaystoneItem = Java.loadClass('com.Polarice3.Goety.common.items.WaystoneItem')
const $AABB = Java.loadClass('net.minecraft.world.phys.AABB')
const $ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
const $ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
const $SoundSource = Java.loadClass('net.minecraft.sounds.SoundSource')

const { readPositions, writePositions, getContainerAt,
    listPositions, removeFromContainer, setTask, taskNames, WORK_DIST_SQ
} = global

const CANNON_RANGE = 32
const CANNON_SCAN_RANGE = 16
const CANNON_POWER = 4
const MELEE_RANGE = 4
const PI = 3.141592653589793
// 弹药优先级（自动索敌）：炸弹 > 火焰弹 > 炮弹（炸弹不破坏地形）
const ammoPriority = [
    'supplementaries:bomb',
    'minecraft:fire_charge',
    'supplementaries:cannonball'
]
// 弹药优先级（定点打击）：炮弹 > 燃烧弹 > 炸弹（与索敌相反）
const strikeAmmoPriority = [
    'supplementaries:cannonball',
    'minecraft:fire_charge',
    'supplementaries:bomb'
]

// 安全地取实体的 UUID 字符串
function entityUuid(entity) {
    try { return entity.getUUID().toString() } catch (e) {}
    try { return String(entity.uuid) } catch (e) {}
    return String(entity.id)
}

// 读取大炮 BE 上记录的绑定者 UUID（无则空字符串）
function cannonOwnerUuid(level, p) {
    let be = getContainerAt(level, p)
    if (!be) return ''
    try {
        if (be.persistentData.contains('requiemCannonOwner')) return be.persistentData.getString('requiemCannonOwner')
    } catch (e) {
        console.log('[敌对炮兵DBG] 读炮位(' + p.join(',') + ') 绑定记录异常: ' + e)
    }
    return ''
}

// 把绑定者 UUID 写入大炮 BE；返回是否成功
function writeCannonOwner(level, p, uuid) {
    let be = getContainerAt(level, p)
    if (!be) {
        console.log('[敌对炮兵DBG] 写绑定失败：炮位(' + p.join(',') + ') 无 BE')
        return false
    }
    try {
        be.persistentData.putString('requiemCannonOwner', String(uuid))
        try { be.setChanged() } catch (e) {}
        console.log('[敌对炮兵DBG] 已写绑定 UUID=' + String(uuid) + ' → 炮位(' + p.join(',') + ')')
        return true
    } catch (e) {
        console.log('[敌对炮兵DBG] 写绑定异常: ' + e)
        return false
    }
}

// 清除大炮 BE 上的绑定记录
function clearCannonOwner(level, p) {
    let be = getContainerAt(level, p)
    if (!be) return
    try {
        if (be.persistentData.contains('requiemCannonOwner')) {
            be.persistentData.remove('requiemCannonOwner')
            try { be.setChanged() } catch (e) {}
            console.log('[敌对炮兵DBG] 已清除炮位(' + p.join(',') + ') 过期绑定')
        }
    } catch (e) {
        console.log('[敌对炮兵DBG] 清绑定异常: ' + e)
    }
}

// 大炮是否已被另一名还活着的敌对炮兵绑定
function cannonBoundByOther(level, p, selfUuid) {
    let owner = cannonOwnerUuid(level, p)
    if (!owner) return false
    if (owner === String(selfUuid)) return false
    let aabb = new $AABB(p[0] - 24, p[1] - 24, p[2] - 24, p[0] + 24, p[1] + 24, p[2] + 24)
    for (let e of level.getEntitiesWithin(aabb)) {
        if (e.type !== 'requiem:artillery_hostile') continue
        try {
            if (entityUuid(e) === owner) {
                console.log('[敌对炮兵DBG] 炮位(' + p.join(',') + ') 已被其他敌对炮兵绑定，跳过')
                return true
            }
        } catch (err) {}
    }
    // 绑定者已不在附近（死亡/卸载），清除过期记录，视作可绑定
    console.log('[敌对炮兵DBG] 炮位(' + p.join(',') + ') 绑定者(' + owner + ')已不在，清除过期记录')
    clearCannonOwner(level, p)
    return false
}

// 找最近的大炮（炮位）：单次立方体扫描，跳过已被其他敌对炮兵绑定的大炮
function findNearestCannon(level, entity) {
    let selfUuid = entityUuid(entity)
    let bx = Math.floor(entity.x), by = Math.floor(entity.y), bz = Math.floor(entity.z)
    for (let dy = -CANNON_SCAN_RANGE; dy <= CANNON_SCAN_RANGE; dy++)
        for (let dz = -CANNON_SCAN_RANGE; dz <= CANNON_SCAN_RANGE; dz++)
            for (let dx = -CANNON_SCAN_RANGE; dx <= CANNON_SCAN_RANGE; dx++) {
                let bc = level.getBlock(bx + dx, by + dy, bz + dz)
                if (bc && bc.id === 'supplementaries:cannon') {
                    let c = [bx + dx, by + dy, bz + dz]
                    if (cannonBoundByOther(level, c, selfUuid)) continue
                    console.log('[敌对炮兵DBG] 选中炮位(' + c.join(',') + ')')
                    return c
                }
            }
    return null
}

// 找开火目标：敌对炮兵攻击玩家，己方攻击敌对怪物；range 默认取 CANNON_RANGE
function findArtilleryTarget(level, entity, hostile, range) {
    let r = range || CANNON_RANGE
    // 优先使用传令兵标记的目标（priorityTarget）——仅炮击索敌生效，近战检测不套用
    if (!range) {
        try {
            if (entity.isPrioritizing && entity.isPrioritizing()) {
                let pt = entity.getPriorityTarget ? entity.getPriorityTarget() : null
                if (pt && pt.isAlive && pt.isAlive()) return pt
            }
        } catch (e) {}
    }
    let aabb = new $AABB(entity.x - r, entity.y - r, entity.z - r,
        entity.x + r, entity.y + r, entity.z + r)
    let best = null
    let bestD = r * r
    for (let e of level.getEntitiesWithin(aabb)) {
        if (!e.isAlive || !e.isAlive()) continue
        if (e.id === entity.id) continue
        // 己方：跳过有主人的仆从（我方/goety 仆从），避免打自己人
        if (!hostile) {
            try {
                let oe = e.getTrueOwner ? e.getTrueOwner() : null
                if (oe) continue
            } catch (err) {}
        }
        let ex = Number(e.x), ey = Number(e.y), ez = Number(e.z)
        if (isNaN(ex) || isNaN(ey) || isNaN(ez)) continue
        let t = String(e.type || '')
        let ok = false
        if (hostile) {
            ok = t === 'minecraft:player' || t.indexOf('villager') !== -1
        } else {
            ok = t.indexOf('zombie') !== -1 || t.indexOf('skeleton') !== -1 || t.indexOf('spider') !== -1 ||
                t.indexOf('creeper') !== -1 || t.indexOf('phantom') !== -1 || t.indexOf('pillager') !== -1 ||
                t.indexOf('vindicator') !== -1 || t.indexOf('witch') !== -1 || t.indexOf('ravager') !== -1 ||
                t.indexOf('inquillager') !== -1 || t.indexOf('crusher') !== -1 || t.indexOf('cryologer') !== -1 ||
                t.indexOf('envioker') !== -1 || t.indexOf('conquillager') !== -1 || t.indexOf('minister') !== -1 ||
                t.indexOf('piker') !== -1 || t.indexOf('preacher') !== -1 || t.indexOf('ripper') !== -1 ||
                t.indexOf('sorcerer') !== -1 || t.indexOf('storm_caster') !== -1 || t.indexOf('tormentor') !== -1 ||
                t.indexOf('trampler') !== -1 || t.indexOf('hunting') !== -1
        }
        if (!ok) continue
        let d = (ex - entity.x) * (ex - entity.x) + (ey - entity.y) * (ey - entity.y) + (ez - entity.z) * (ez - entity.z)
        if (d < bestD) { bestD = d; best = e }
    }
    return best
}

// 从木桶取弹药（己方），返回 true 表示有货；按给定优先级选择弹药
function takeAmmoFromBarrel(level, pos, cannonBe, priority) {
    if (!pos.barrels || pos.barrels.length === 0) return false
    let barrel = getContainerAt(level, pos.barrels[0])
    if (!barrel) return false
    let chosen = null
    for (let ammo of priority) {
        for (let i = 0; i < barrel.getContainerSize(); i++) {
            let s = barrel.getItem(i)
            if (!s.isEmpty() && s.id === ammo) { chosen = ammo; break }
        }
        if (chosen) break
    }
    if (!chosen) return false
    let gunpowder = removeFromContainer(barrel, 'minecraft:gunpowder', CANNON_POWER)
    if (gunpowder < CANNON_POWER) return false
    let ball = removeFromContainer(barrel, chosen, 1)
    if (ball < 1) return false
    cannonBe.setFuel(Item.of('minecraft:gunpowder', CANNON_POWER))
    cannonBe.setProjectile(Item.of(chosen))
    return true
}

// 炮位初始朝向（射界中心，单位度）；垂直炮位返回 null
function cannonInitialYaw(level, cannonPos) {
    // 方法1：用大炮自身的射界约束求中心（最可靠）
    let be = getContainerAt(level, cannonPos)
    if (be) {
        try {
            let r = be.getPitchAndYawRestrains()
            if (r) {
                let min = Number(r.minYaw())
                let max = Number(r.maxYaw())
                if (!isNaN(min) && !isNaN(max) && !(min <= -360 && max >= 360)) {
                    let c = (min + max) / 2
                    while (c > 180) c -= 360
                    while (c < -180) c += 360
                    return c
                }
            }
        } catch (e) {}
    }
    // 方法2：读方块状态 facing
    let bc = level.getBlock(cannonPos[0], cannonPos[1], cannonPos[2])
    if (bc) {
        try {
            let props = bc.getProperties()
            if (props) {
                let facing = props.get('facing')
                let f = String(facing).toLowerCase()
                if (f.indexOf('north') !== -1) return 0
                if (f.indexOf('south') !== -1) return 180
                if (f.indexOf('west') !== -1) return -90
                if (f.indexOf('east') !== -1) return 90
            }
        } catch (e) {}
    }
    return null
}

// 判断炮位是否朝上（迫击炮，用于曲射）
function cannonFacingIsUp(level, cannonPos) {
    let bc = level.getBlock(cannonPos[0], cannonPos[1], cannonPos[2])
    if (!bc) return false
    try {
        let props = bc.getProperties()
        if (props) {
            let f = String(props.get('facing')).toLowerCase()
            return f.indexOf('up') !== -1
        }
    } catch (e) {}
    return false
}

// 找炮位旁可站立的操作位（大炮是实心方块，炮兵不能站到炮位中心上）
function findCannonStand(level, cannon) {
    let airIds = { 'minecraft:air': true, 'minecraft:cave_air': true, 'minecraft:void_air': true }
    let offsets = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
    for (let o of offsets) {
        let bx = cannon[0] + o[0], by = cannon[1], bz = cannon[2] + o[1]
        let self = level.getBlock(bx, by, bz)
        let above = level.getBlock(bx, by + 1, bz)
        if (!self || !above) continue
        if (airIds[self.id] && airIds[above.id]) return [bx + 0.5, by, bz + 0.5]
    }
    // 找不到就退回炮位中心（至少方向对）
    return [cannon[0] + 0.5, cannon[1], cannon[2] + 0.5]
}

// 播放炮兵开火/停火提示音
function playCannonSignal(level, x, y, z, soundId) {
    try {
        let s = $ForgeRegistries.SOUND_EVENTS.getValue(new $ResourceLocation(soundId))
        if (s) level.playSound(null, x, y, z, s, $SoundSource.PLAYERS, 0.6, 1.0)
    } catch (e) {}
}

// 记录炮兵开火/停火状态；状态切换时播放提示音
function setArtilleryFiring(entity, level, firing) {
    let cur = entity.persistentData.getBoolean('artilleryFiring')
    if (cur === firing) return
    entity.persistentData.putBoolean('artilleryFiring', firing)
    playCannonSignal(level, entity.x, entity.y + 1, entity.z,
        firing ? 'minecraft:event.raid.horn' : 'minecraft:block.note_block.pling')
}

// 装填弹药并开火
function loadAndFire(entity, level, cannonPos, hostile) {
    let be = getContainerAt(level, cannonPos)
    let dbg = entity.persistentData.getInt('dbgCount')
    let dlog = dbg % 10 === 0
    if (!be) { if (dlog) console.log('[炮兵DBG] loadAndFire: 无大炮 BE ' + cannonPos); return }
    let pos = readPositions(entity)
    // 正在开火（导火索）→ 跳过
    try {
        if (be.isFiring && be.isFiring()) { if (dlog) console.log('[炮兵DBG] loadAndFire: 导火索中'); return }
    } catch (e) {}
    // 目标：优先用炮射地图指定的打击坐标，否则自动索敌
    let isStrike = pos.strikeTarget && pos.strikeTarget.length === 3
    let tx, ty, tz
    if (isStrike) {
        tx = Number(pos.strikeTarget[0]) + 0.5
        ty = Number(pos.strikeTarget[1]) + 0.5
        tz = Number(pos.strikeTarget[2]) + 0.5
    } else {
        let target = findArtilleryTarget(level, entity, hostile)
        if (!target) { if (dlog) console.log('[炮兵DBG] loadAndFire: 无索敌目标'); setTask(entity, '无目标'); return }
        tx = Number(target.x), ty = Number(target.y), tz = Number(target.z)
    }
    if (isNaN(tx) || isNaN(ty) || isNaN(tz)) return
    // 装填弹药（敌对无限；己方仅在空时从木桶取）
    let hasAmmo = false
    try { hasAmmo = !!(be.hasFuelAndProjectiles && be.hasFuelAndProjectiles()) } catch (e) {}
    if (hostile) {
        be.setFuel(Item.of('minecraft:gunpowder', CANNON_POWER))
        be.setProjectile(Item.of('supplementaries:bomb'))
    } else if (!hasAmmo) {
        if (!takeAmmoFromBarrel(level, pos, be, isStrike ? strikeAmmoPriority : ammoPriority)) {
            if (dlog) console.log('[炮兵DBG] loadAndFire: 木桶缺火药/炮弹')
            setTask(entity, '木桶缺火药/炮弹')
            return
        }
    }
    // 冷却检查（装填后再判断，避免空炮时 readyToFire 恒为 false 而永远不装填）
    try {
        if (be.readyToFire && !be.readyToFire()) { if (dlog) console.log('[炮兵DBG] loadAndFire: 冷却中'); return }
    } catch (e) {}
    // 瞄准（补充物大炮：yaw/pitch 为世界角度，单位度）
    let dx = tx - (cannonPos[0] + 0.5)
    let dy = ty - (cannonPos[1] + 0.5)
    let dz = tz - (cannonPos[2] + 0.5)
    let len = Math.sqrt(dx * dx + dy * dy + dz * dz)
    if (len < 0.5) { if (dlog) console.log('[炮兵DBG] loadAndFire: 目标过近'); setTask(entity, '目标过近'); return }
    let yaw = Math.atan2(dx, -dz) * 180 / PI
    // 射界限制：仅水平大炮（facing=north/south/east/west）才限制左/右 90 度；垂直迫击炮 360 度自由
    let initYaw = cannonInitialYaw(level, cannonPos)
    if (initYaw !== null) {
        let diff = yaw - initYaw
        while (diff > 180) diff -= 360
        while (diff < -180) diff += 360
        if (diff > 90 || diff < -90) {
            if (dlog) console.log('[炮兵DBG] loadAndFire: 目标超出射界 initYaw=' + initYaw + ' yaw=' + yaw)
            setTask(entity, '目标超出射界')
            return
        }
    }
    let ratio = dy / len
    if (ratio > 1) ratio = 1
    if (ratio < -1) ratio = -1
    // 正常直射：直接瞄准目标（水平/垂直炮通用）
    let pitch = Math.asin(ratio) * 180 / PI
    if (isNaN(yaw) || isNaN(pitch)) return
    try { be.setAttributes(yaw, pitch, CANNON_POWER, false, null) } catch (e) {}
    // 开火
    try { be.ignite(entity) } catch (e) {}
    if (dlog) console.log('[炮兵DBG] loadAndFire: 已 ignite 目标=(' + tx.toFixed(1) + ',' + ty.toFixed(1) + ',' + tz.toFixed(1) + ')')
    setArtilleryFiring(entity, level, true)
}

global.artilleryInteract = (ctx) => {
    const { entity, player } = ctx
    if (!player || player.level.isClientSide()) return
    let held = player.mainHandItem
    if (held.id === 'kubejs:store_list') {
        let list = listPositions(held)
        let pos = readPositions(entity)
        pos.barrels = list.map(p => [p[0], p[1], p[2]])
        writePositions(entity, pos)
        player.tell('已设置炮兵 ' + list.length + ' 个弹药木桶')
        return
    }
    if (held.id === 'kubejs:strike_map') {
        let nbt = held.nbt
        let pos = readPositions(entity)
        if (!nbt || !nbt.contains('strikeX')) {
            // 空炮射地图：清除打击目标（恢复自动索敌）
            if (pos.strikeTarget) {
                delete pos.strikeTarget
                writePositions(entity, pos)
                player.tell('已清除炮兵打击坐标（恢复自动索敌）')
            } else {
                player.tell('炮射地图未设置坐标（手持地图右键视线内方块，或 /requiem strike <x> <y> <z>）')
            }
            return
        }
        let x = nbt.getInt('strikeX'), y = nbt.getInt('strikeY'), z = nbt.getInt('strikeZ')
        pos.strikeTarget = [x, y, z]
        writePositions(entity, pos)
        player.tell('已设置炮兵打击坐标 (' + x + ',' + y + ',' + z + ')')
        return
    }
    if (held.id !== 'goety:waystone') held = player.offHandItem
    if (held.id !== 'goety:waystone') return
    if (!$WaystoneItem.hasBlock(held)) return
    let blockPos = $WaystoneItem.getBlockPos(held)
    if (!blockPos) return
    let x = blockPos.getX(), y = blockPos.getY(), z = blockPos.getZ()
    let blockId = player.level.getBlock(x, y, z).id
    if (blockId !== 'supplementaries:cannon') { player.tell('炮兵只能绑定大炮'); return }
    let pos = readPositions(entity)
    pos.cannon = [x, y, z]
    try {
        let cbe = getContainerAt(player.level, [x, y, z])
        if (cbe) pos.cannonYaw = Number(cbe.getYaw())
    } catch (e) {}
    writePositions(entity, pos)
    player.tell('已设置炮兵的炮位')
}

// 炮兵主手在火把（开火）与剑（近战）间切换；用 persistentData 记录当前姿态避免重复设置
function updateArtilleryWeapon(entity, sword) {
    let cur = entity.persistentData.getBoolean('artillerySword')
    if (cur === sword) return
    entity.persistentData.putBoolean('artillerySword', sword)
    try { entity.setMainHandItem(Item.of(sword ? 'minecraft:iron_sword' : 'minecraft:torch')) } catch (e) {}
}

global.artilleryAI = (entity) => {
    let hostile = entity.type === 'requiem:artillery_hostile'
    let level = entity.level
    let pos = readPositions(entity)

    // 武器切换：近战用剑，开火/待命用火把
    let meleeTarget = findArtilleryTarget(level, entity, hostile, MELEE_RANGE)
    updateArtilleryWeapon(entity, !!meleeTarget)
    if (meleeTarget) {
        try { entity.setTarget(meleeTarget) } catch (e) {}
        setTask(entity, '近战反击')
        return
    }
    try { entity.setTarget(null) } catch (e) {}

    // 冷却计数器（也用于敌对炮兵绑定炮位的节流扫描）
    let dbgCount = entity.persistentData.getInt('dbgCount')
    dbgCount++
    entity.persistentData.putInt('dbgCount', dbgCount)

    // DBG：节流打印状态
    if (dbgCount % 10 === 0) {
        let g = 'n/a'
        try { g = String(entity.isGuardingArea()) } catch (e) {}
        console.log('[炮兵DBG] type=' + entity.type + ' hostile=' + hostile + ' guard=' + g +
            ' cannon=' + (pos.cannon ? pos.cannon.join(',') : 'null') +
            ' strike=' + (pos.strikeTarget ? pos.strikeTarget.join(',') : 'null') +
            ' fireMode=' + entity.persistentData.getString('captainFireMode') +
            ' leaderAlive=' + (function () { try { let l = entity.getLeader(); return !!(l && l.isAlive()); } catch (e) { return 'err' } })())
    }

    if (!hostile && !entity.isGuardingArea()) {
        if (dbgCount % 10 === 0) console.log('[炮兵DBG] 未驻守 → 跟随')
        setTask(entity, taskNames.follow)
        return
    }

    // 敌对：绑定最近炮位（带冷却，每 5 秒扫一次，避免卡顿）
    if (!pos.cannon) {
        if (hostile) {
            let lastScan = entity.persistentData.getLong('cannonScanTick')
            if (dbgCount - lastScan >= 5) {
                entity.persistentData.putLong('cannonScanTick', dbgCount)
                let c = findNearestCannon(level, entity)
                if (c) {
                    pos.cannon = c
                    try {
                        let cbe = getContainerAt(level, c)
                        if (cbe) pos.cannonYaw = Number(cbe.getYaw())
                    } catch (e) {}
                    // 先持久化炮位（无论 BE 写入是否成功，都要让炮兵进入操炮流程）
                    writePositions(entity, pos)
                    let ok = writeCannonOwner(level, c, entityUuid(entity))
                    console.log('[敌对炮兵] 绑定炮位(' + c.join(',') + ') 写BE=' + ok)
                } else {
                    console.log('[敌对炮兵] 附近没有可用炮位（不存在或已被其他敌对炮兵绑定）')
                }
            }
        }
        if (!pos.cannon) {
            setTask(entity, hostile ? '未找到炮位' : '空闲（未设置炮位）')
            return
        }
    }

    // 前往炮位：连队里的炮兵由 Java 侧 FormationSlotGoal（orderToCannon）负责带到炮位，
    // 这里只在没有连队站位令时才自己走过去，避免两边抢寻路导致炮兵原地抽搐。
    let stand = findCannonStand(level, pos.cannon)
    let dx = entity.x - stand[0]
    let dy = entity.y - stand[1]
    let dz = entity.z - stand[2]
    if (dx * dx + dy * dy + dz * dz > WORK_DIST_SQ) {
        let inCompany = false
        try { inCompany = entity.persistentData.contains('RequiemFormation') } catch (e) {}
        if (!inCompany) {
            entity.navigation.moveTo(stand[0], stand[1], stand[2], 1.0)
        }
        setTask(entity, '前往炮位')
        return
    }

    // 炮兵小队：队长阵亡则停火；玩家吹号后临时恢复开火一轮
    let leader = null
    try { leader = entity.getLeader() } catch (e) {}
    let leaderAlive = !!(leader && leader.isAlive && leader.isAlive())
    let hornTimer = entity.persistentData.getInt('hornFireTimer')
    if (hornTimer > 0) {
        hornTimer--
        entity.persistentData.putInt('hornFireTimer', hornTimer)
    }
    if (leaderAlive) {
        try {
            if (leader.persistentData.getBoolean('HornFire')) {
                leader.persistentData.putBoolean('HornFire', false)
                entity.persistentData.putInt('hornFireTimer', 3)
                hornTimer = 3
            }
        } catch (e) {}
    }
    let hornRecent = hornTimer > 0
    if (!leaderAlive && entity.persistentData.getBoolean('inArtillerySquad') && !hornRecent) {
        setArtilleryFiring(entity, level, false)
        setTask(entity, '队长阵亡，停火')
        return
    }

    // 开火模式（由炮兵队长同步）：停火模式不索敌也不开火
    let captainFireMode = entity.persistentData.getString('captainFireMode')
    if (captainFireMode === 'cease') {
        setArtilleryFiring(entity, level, false)
        setTask(entity, '停火')
        return
    }

    // 开火目标：有打击坐标或有索敌目标才行动
    let hasStrike = pos.strikeTarget && pos.strikeTarget.length === 3
    let target = findArtilleryTarget(level, entity, hostile)
    if (!target && !hasStrike) {
        if (dbgCount % 10 === 0) console.log('[炮兵DBG] 无目标且无打击坐标')
        setArtilleryFiring(entity, level, false)
        setTask(entity, '空闲（无目标）')
        return
    }
    if (dbgCount % 10 === 0) console.log('[炮兵DBG] 准备开火 strike=' + hasStrike + ' target=' + (target ? String(target.type) : 'null'))

    loadAndFire(entity, level, pos.cannon, hostile)
    setTask(entity, '装填开火')
}
})();
