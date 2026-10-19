(function () {
// ============================================================
//  炮兵队长：指挥一支炮兵小队
//  机制：接受存储列表（弹药木桶）、炮射地图（打击目标）、号角右键地面（阵地）
//        右键队长切换 停火 / 自由射击 / 射击标记地点
// ============================================================

const $AABB = Java.loadClass('net.minecraft.world.phys.AABB')

const { readPositions, writePositions, listPositions, setTask } = global

const SCAN_RANGE = 16

// 读取队长状态（JSON 存于 NBT）
function readState(entity) {
    let s = entity.persistentData.getString('CaptainState')
    return s ? JSON.parse(s) : {}
}
function writeState(entity, state) {
    entity.persistentData.putString('CaptainState', JSON.stringify(state))
}

// 找附近的大炮（空炮位）
function findCannons(level, center) {
    let list = []
    for (let dy = -2; dy <= 2; dy++)
        for (let dz = -SCAN_RANGE; dz <= SCAN_RANGE; dz++)
            for (let dx = -SCAN_RANGE; dx <= SCAN_RANGE; dx++) {
                let bc = level.getBlock(center[0] + dx, center[1] + dy, center[2] + dz)
                if (bc && bc.id === 'supplementaries:cannon') list.push([center[0] + dx, center[1] + dy, center[2] + dz])
            }
    return list
}

// 找小队里的炮兵（读 persistentData.artilleryCaptainUuid，由 Java 侧 setCommandPosEntity 覆写持久化，稳定跨存档）
function findSquadArtillery(level, captain) {
    let captainUuid = ''
    try { captainUuid = String(captain.uuid) } catch (e) {}
    let aabb = new $AABB(captain.x - 64, captain.y - 64, captain.z - 64, captain.x + 64, captain.y + 64, captain.z + 64)
    let list = []
    for (let e of level.getEntitiesWithin(aabb)) {
        if (e.type !== 'requiem:artillery') continue
        try {
            let cu = String(e.persistentData.getString('artilleryCaptainUuid') || '')
            if (cu && cu === captainUuid) { list.push(e); continue }
            let cmd = e.getCommandPosEntity()
            if (cmd && cmd.id === captain.id) list.push(e)
        } catch (err) {}
    }
    return list
}

// 队长交互
global.artilleryCaptainInteract = (ctx) => {
    const { entity, player } = ctx
    if (!player || player.level.isClientSide()) return
    let held = player.mainHandItem
    let state = readState(entity)

    if (held.id === 'kubejs:store_list') {
        let list = listPositions(held)
        state.barrels = list.map(p => [p[0], p[1], p[2]])
        writeState(entity, state)
        player.tell('已设置炮兵队长 ' + list.length + ' 个弹药木桶')
        return
    }
    if (held.id === 'kubejs:strike_map') {
        let nbt = held.nbt
        if (!nbt || !nbt.contains('strikeX')) {
            delete state.strikeTarget
            writeState(entity, state)
            player.tell('已清除炮兵队长的打击坐标')
            return
        }
        state.strikeTarget = [nbt.getInt('strikeX'), nbt.getInt('strikeY'), nbt.getInt('strikeZ')]
        state.fireMode = 'marked'
        writeState(entity, state)
        player.tell('已设置炮兵队长打击坐标 (' + state.strikeTarget.join(',') + ')，切换到射击标记地点')
        return
    }

    // 空手右键：切换 自由射击 / 射击标记地点 / 停火
    let modes = ['free', 'marked', 'cease']
    let cur = state.fireMode || 'free'
    let next = modes[(modes.indexOf(cur) + 1) % modes.length]
    state.fireMode = next
    writeState(entity, state)
    let names = { cease: '停火', free: '自由射击', marked: '射击标记地点' }
    player.tell('炮兵开火模式：' + names[next])
}

// 队长 AI
global.artilleryCaptainAI = (entity) => {
    let level = entity.level
    let state = readState(entity)

    // 号角设定的阵地
    let batteryStr = entity.persistentData.getString('Battery')
    let battery = batteryStr ? JSON.parse(batteryStr) : null

    let squad = findSquadArtillery(level, entity)

    // DBG：节流打印小队人数
    let d = entity.persistentData.getInt('dbgCount')
    d++
    entity.persistentData.putInt('dbgCount', d)
    if (d % 10 === 0) {
        let keys = []
        try {
            for (let k of entity.persistentData.getAllKeys()) keys.push(k)
        } catch (e) {}
        console.log('[炮兵队长DBG] 小队炮兵数=' + squad.length + ' mode=' + (state.fireMode || 'free') +
            ' battery=' + (battery ? battery.join(',') : 'null') +
            ' batteryStr=' + (batteryStr || '(空)') +
            ' uuid=' + (function () { try { return String(entity.uuid) } catch (e) { return 'err' } })() +
            ' keys=[' + keys.join(',') + ']')
    }

    // 自动分配炮兵到阵地附近的空炮位
    if (battery) {
        let cannons = findCannons(level, battery)
        for (let a of squad) {
            let apos = readPositions(a)
            if (apos.cannon) continue
            if (cannons.length === 0) break
            apos.cannon = cannons.shift()
            writePositions(a, apos)
        }
    }

    // 把开火模式与打击坐标同步给小队的炮兵
    let mode = state.fireMode || 'free'
    for (let a of squad) {
        let apos = readPositions(a)
        a.persistentData.putString('captainFireMode', mode)
        if (mode === 'marked' && state.strikeTarget) {
            apos.strikeTarget = state.strikeTarget
        } else if (mode !== 'marked') {
            delete apos.strikeTarget
        }
        // 同步弹药木桶（存储列表）
        if (state.barrels && state.barrels.length > 0) {
            apos.barrels = state.barrels
        }
        writePositions(a, apos)
    }

    let task = mode === 'cease' ? '停火' : (mode === 'marked' ? '射击标记地点' : '自由射击')
    setTask(entity, task)
}

// 号角右键地面：把阵地写入炮兵队长的 KubeJS persistentData
BlockEvents.rightClicked(event => {
    let player = event.player
    if (!player || player.level.isClientSide()) return
    let held = player.mainHandItem
    if (held.id !== 'requiem:artillery_horn') return
    let nbt = held.nbt
    console.log('[炮兵号角DBG] 号角右键方块 block=' + event.block.id + ' pos=(' + event.block.x + ',' + event.block.y + ',' + event.block.z + ')')
    if (!nbt || !nbt.contains('Captain')) {
        console.log('[炮兵号角DBG] 号角未绑定（无 Captain）')
        return
    }
    let captain = null
    try {
        let uuid = nbt.getUUID('Captain')
        console.log('[炮兵号角DBG] 号角绑定队长 UUID=' + uuid)
        for (let e of player.server.entities) {
            if (e.type !== 'requiem:artillery_captain') continue
            if (String(e.uuid) === String(uuid)) { captain = e; break }
        }
    } catch (e) {
        console.log('[炮兵号角DBG] 解析 Captain 异常: ' + e)
    }
    if (!captain) {
        console.log('[炮兵号角DBG] 没找到绑定的炮兵队长')
        return
    }
    captain.persistentData.putString('Battery',
        '[' + event.block.x + ',' + event.block.y + ',' + event.block.z + ']')
    console.log('[炮兵号角DBG] 已写入 Battery → (' + event.block.x + ',' + event.block.y + ',' + event.block.z + ')')
    player.tell('已设定炮兵阵地 (' + event.block.x + ',' + event.block.y + ',' + event.block.z + ')')
})
})();
