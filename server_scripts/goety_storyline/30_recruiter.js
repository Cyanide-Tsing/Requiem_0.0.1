(function () {
// ============================================================
//  征兵官：将未训练刌民分配到对应不祥火炬
// ============================================================

const $AABB = Java.loadClass('net.minecraft.world.phys.AABB')

const { readPositions, writePositions, getContainerAt, listPositions,
    setTask, tellOwner, taskNames, WORK_DIST_SQ
} = global

// 魔法资质优先级：巫师 > 唤魔者 > 传教士 > 冰术士 > 地卜师 > 唤风者
const magicTorchTypes = ['warlock', 'evoker', 'heretic', 'iceologer', 'geomancer', 'wind_caller']
// 无魔法资质优先级：掠夺者 > 卫道士
const meleeTorchTypes = ['pillager', 'vindicator']

// 已分配刌民 ID 列表（存于征兵官 NBT；防止重复向同一刌民分配火炬）
function getAssigned(entity) {
    try {
        let s = entity.persistentData.getString('assigned')
        return s ? JSON.parse(s) : []
    } catch (e) { return [] }
}
function setAssigned(entity, arr) {
    entity.persistentData.putString('assigned', JSON.stringify(arr))
}

// 找附近的未训练刌民（goety:neollager）；跳过“有魔法资质的小刌民”、已分配、已在训练的
function findUntrainedIllager(level, entity) {
    let assigned = getAssigned(entity)
    let skip = {}
    for (let id of assigned) skip[id] = true
    let aabb = new $AABB(entity.x - 16, entity.y - 16, entity.z - 16, entity.x + 16, entity.y + 16, entity.z + 16)
    for (let e of level.getEntitiesWithin(aabb)) {
        if (e.type !== 'goety:neollager') continue
        if (e === entity) continue
        if (skip[e.id]) continue
        let baby = false, magic = false
        try { baby = !!e.isBaby() } catch (err) {}
        try { magic = !!e.isMagic() } catch (err) {}
        if (baby && magic) continue
        try { if (e.isTraining && e.isTraining()) continue } catch (err) {}
        return e
    }
    return null
}

// 读取火炬训练类型字符串（goety 原版：getCurrentMob）
function torchTypeOf(level, p) {
    let be = level.getBlockEntity(new BlockPos(p[0], p[1], p[2]))
    if (!be) return ''
    try { if (be.getCurrentMob) return String(be.getCurrentMob()).toLowerCase() } catch (e) {}
    return ''
}

// 火炬是否完整（有确定类型）且有空位（当前训练数量 < 上限）
function torchUsable(level, p) {
    let be = level.getBlockEntity(new BlockPos(p[0], p[1], p[2]))
    if (!be) return false
    if (!torchTypeOf(level, p)) return false
    try {
        let cur = be.getCurrentAmount ? be.getCurrentAmount() : 0
        let limit = be.trainLimit ? be.trainLimit() : 0
        if (limit > 0 && cur >= limit) return false
    } catch (e) {}
    return true
}

// 按优先级找匹配的火炬；上一优先级满了/没有就顺延到下个类型
function findTorch(level, torches, magic) {
    let types = magic ? magicTorchTypes : meleeTorchTypes
    for (let type of types) {
        for (let p of (torches || [])) {
            if (!torchUsable(level, p)) continue
            let t = torchTypeOf(level, p)
            if (t && t.indexOf(type) !== -1) return { pos: p, type: type }
        }
    }
    return null
}

// ---------- 征兵官交互 ----------
global.recruiterInteract = (ctx) => {
    const { entity, player } = ctx
    if (!player || player.level.isClientSide()) return
    let held = player.mainHandItem
    if (held.id === 'kubejs:torch_list') {
        let list = listPositions(held)
        let pos = readPositions(entity)
        pos.torches = list.map(p => [p[0], p[1], p[2]])
        writePositions(entity, pos)
        player.tell('已设置征兵官 ' + list.length + ' 个不祥火炬位置')
        return
    }
}

// ---------- 征兵官主 AI ----------
global.recruiterAI = (entity) => {
    if (!entity.isGuardingArea()) {
        setTask(entity, taskNames.follow)
        return
    }
    let level = entity.level
    let pos = readPositions(entity)
    let torches = pos.torches || []
    if (!torches.length) {
        setTask(entity, '空闲（未设置不祥火炬）')
        return
    }
    let illager = findUntrainedIllager(level, entity)
    if (!illager) {
        setTask(entity, '空闲（附近没有未训练刌民）')
        return
    }
    let magic = false
    try { magic = !!illager.isMagic() } catch (e) {}
    let torch = findTorch(level, torches, magic)
    if (!torch) {
        setTask(entity, '空闲（无可用' + (magic ? '魔法' : '近战') + '火炬）')
        return
    }
    let dx = entity.x - (torch.pos[0] + 0.5)
    let dy = entity.y - torch.pos[1]
    let dz = entity.z - (torch.pos[2] + 0.5)
    if (dx * dx + dy * dy + dz * dz > WORK_DIST_SQ) {
        entity.navigation.moveTo(torch.pos[0] + 0.5, torch.pos[1], torch.pos[2] + 0.5, 1.0)
        setTask(entity, '前往 ' + torch.type + ' 火炬分配')
        return
    }
    let be = level.getBlockEntity(new BlockPos(torch.pos[0], torch.pos[1], torch.pos[2]))
    if (be) {
        let bpos = new BlockPos(torch.pos[0], torch.pos[1], torch.pos[2])
        try {
            be.addTrainable(illager, level, bpos)
        } catch (e) {}
        try {
            if (illager.setTrainPos) illager.setTrainPos(bpos)
            if (illager.setStoredTrainPos) illager.setStoredTrainPos(bpos)
        } catch (e) {}
        try {
            if (illager.setWandering) illager.setWandering(false)
            if (illager.setStaying) illager.setStaying(true)
        } catch (e) {}
        let assigned = getAssigned(entity)
        if (assigned.indexOf(illager.id) === -1) {
            assigned.push(illager.id)
            if (assigned.length > 100) assigned = assigned.slice(-100)
            setAssigned(entity, assigned)
        }
        tellOwner(entity, '已将 ' + (magic ? '魔法' : '近战') + '刌民分配到 ' + torch.type + ' 火炬')
    }
    setTask(entity, '分配 ' + torch.type)
}
})();
