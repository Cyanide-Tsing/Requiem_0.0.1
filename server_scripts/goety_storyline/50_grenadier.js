(function () {
// ============================================================
//  掷弹兵仆从 / 敌对掷弹兵
//  行为：向索敌目标投掷 Supplementaries 炸弹，近战用剑自卫
// ============================================================

const $BombEntity = Java.loadClass('net.mehvahdjukaar.supplementaries.common.entities.BombEntity')
const $BombType = Java.loadClass('net.mehvahdjukaar.supplementaries.common.entities.BombEntity$BombType')
const $AABB = Java.loadClass('net.minecraft.world.phys.AABB')

const { setTask } = global

const BOMB_RANGE = 20
const BOMB_MIN_DIST = 3
const THROW_COOLDOWN_CALLS = 2
const THROW_VELOCITY = 1.5
const THROW_INACCURACY = 0.6
const PI = 3.141592653589793

// 找投弹目标：敌对掷弹兵打玩家/村民，己方打敌对怪物；跳过有主人的仆从
function findGrenadierTarget(level, entity, hostile) {
    let aabb = new $AABB(entity.x - BOMB_RANGE, entity.y - BOMB_RANGE, entity.z - BOMB_RANGE,
        entity.x + BOMB_RANGE, entity.y + BOMB_RANGE, entity.z + BOMB_RANGE)
    let best = null
    let bestD = BOMB_RANGE * BOMB_RANGE
    for (let e of level.getEntitiesWithin(aabb)) {
        if (!e.isAlive || !e.isAlive()) continue
        if (e.id === entity.id) continue
        if (!hostile) {
            try {
                let oe = e.getTrueOwner ? e.getTrueOwner() : null
                if (oe) continue
            } catch (err) {}
        }
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
        let d = (e.x - entity.x) * (e.x - entity.x) + (e.y - entity.y) * (e.y - entity.y) + (e.z - entity.z) * (e.z - entity.z)
        if (d < bestD) { bestD = d; best = e }
    }
    return best
}

// 朝目标投一颗炸弹（带一点仰角补偿重力）
function throwBomb(level, entity, target) {
    try {
        let dx = target.x - entity.x
        let dz = target.z - entity.z
        let dy = (target.y + 1.0) - entity.getEyeY()
        let len = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (len < 0.01) return false
        dy += len * 0.08
        let bomb = new $BombEntity(level, entity, $BombType.NORMAL)
        bomb.shoot(dx, dy, dz, THROW_VELOCITY, THROW_INACCURACY)
        level.addFreshEntity(bomb)
        // 面向目标（仅外观）
        let yaw = Math.atan2(dx, -dz) * 180 / PI
        try {
            entity.setYRot(yaw)
            entity.setYHeadRot(yaw)
        } catch (e) {}
        return true
    } catch (err) {
        return false
    }
}

global.grenadierAI = (entity) => {
    let hostile = entity.type === 'requiem:grenadier_hostile'
    let level = entity.level

    // AI 调用计数（用于投弹冷却，每 20 刻调用一次）
    let dbg = entity.persistentData.getInt('gdbg')
    dbg++
    entity.persistentData.putInt('gdbg', dbg)

    let target = findGrenadierTarget(level, entity, hostile)
    if (!target) {
        setTask(entity, '待命')
        return
    }

    // 太近则后撤保持距离，避免炸到自己
    let dx = target.x - entity.x
    let dz = target.z - entity.z
    let distSq = dx * dx + dz * dz
    if (distSq < BOMB_MIN_DIST * BOMB_MIN_DIST) {
        let awayX = entity.x - dx
        let awayZ = entity.z - dz
        try { entity.navigation.moveTo(awayX, entity.y, awayZ, 1.2) } catch (e) {}
        setTask(entity, '保持距离')
        return
    }

    // 投弹冷却（dbg 每 20 刻 AI 调用一次递增 1，2 次调用 = 2 秒）
    let last = entity.persistentData.getLong('grenadierLastThrow')
    if (dbg - last < THROW_COOLDOWN_CALLS) {
        setTask(entity, '装填')
        return
    }
    entity.persistentData.putLong('grenadierLastThrow', dbg)
    throwBomb(level, entity, target)
    setTask(entity, '投弹')
}
})();
