(function () {
// ============================================================
//  Requiem 仆从标准函数库（共享工具 + 事件分发）
//  所有函数挂载到 global，供各仆从实现文件（10_*.js 等）调用
// ============================================================

const $WaystoneItem = Java.loadClass('com.Polarice3.Goety.common.items.WaystoneItem')
const $IWand = Java.loadClass('com.Polarice3.Goety.api.items.magic.IWand')
const $EnchantmentHelper = Java.loadClass('net.minecraft.world.item.enchantment.EnchantmentHelper')
const $ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')
const $AABB = Java.loadClass('net.minecraft.world.phys.AABB')
const $ComposterBlock = Java.loadClass('net.minecraft.world.level.block.ComposterBlock')
const $ParticleTypes = Java.loadClass('net.minecraft.core.particles.ParticleTypes')

const WORK_DIST_SQ = 6.25
const FURNACE_OUTPUT_THRESHOLD = 16

// ---------- 库存（JSON 存于 NBT） ----------
function readInv(entity) {
    let s = entity.persistentData.getString('Inv')
    return s ? JSON.parse(s) : {}
}
function writeInv(entity, inv) {
    entity.persistentData.putString('Inv', JSON.stringify(inv))
}
function addInv(inv, id, count) {
    inv[id] = (inv[id] || 0) + count
    if (inv[id] <= 0) delete inv[id]
}
function removeInv(inv, id, count) {
    if (!inv[id] || inv[id] < count) return false
    inv[id] -= count
    if (inv[id] <= 0) delete inv[id]
    return true
}
function findInv(inv, list) {
    for (let id in inv) {
        if (list.indexOf(id) !== -1) return id
    }
    return null
}

// ---------- 方块位置（JSON 存于 NBT） ----------
function readPositions(entity) {
    let s = entity.persistentData.getString('Positions')
    return s ? JSON.parse(s) : {}
}
function writePositions(entity, pos) {
    entity.persistentData.putString('Positions', JSON.stringify(pos))
}
function getContainerAt(level, pos) {
    if (!pos) return null
    return level.getBlockEntity(new BlockPos(pos[0], pos[1], pos[2]))
}
function drainContainerSlot(level, inv, pos, slot) {
    let be = getContainerAt(level, pos)
    if (!be) return
    let stack = be.getItem(slot)
    if (!stack.isEmpty()) {
        addInv(inv, stack.id, stack.count)
        be.setItem(slot, $ItemStack.EMPTY)
    }
}

// ---------- 列表物品记录位置 ----------
function listPositions(stack) {
    try {
        if (!stack.nbt) return []
        let s = stack.nbt.getString('positions')
        return s ? JSON.parse(s) : []
    } catch (e) { return [] }
}
function setListPositions(stack, arr) {
    try {
        let nbt = null
        if (typeof stack.getOrCreateTag === 'function') nbt = stack.getOrCreateTag()
        if (!nbt && stack.nbt) nbt = stack.nbt
        if (nbt && typeof nbt.putString === 'function') nbt.putString('positions', JSON.stringify(arr))
    } catch (e) {}
}
function addListPosition(stack, p) {
    let arr = listPositions(stack)
    for (let q of arr) if (q[0] === p[0] && q[1] === p[1] && q[2] === p[2]) return arr
    arr.push([p[0], p[1], p[2]])
    setListPositions(stack, arr)
    return arr
}

// ---------- 存储容器 ----------
function getStorageContainers(level, pos) {
    let list = []
    let seen = {}
    function add(p) {
        if (!p) return
        let key = p[0] + ',' + p[1] + ',' + p[2]
        if (seen[key]) return
        seen[key] = true
        let be = getContainerAt(level, p)
        if (be) list.push(be)
    }
    if (pos.barrels) for (let p of pos.barrels) add(p)
    if (pos.chest) add(pos.chest)
    if (pos.raiderChest) add(pos.raiderChest)
    return list
}
function getStorageChest(level, pos) {
    return getStorageContainers(level, pos)[0] || null
}
function firstStoragePos(pos) {
    if (pos.barrels && pos.barrels.length) return pos.barrels[0]
    if (pos.chest) return pos.chest
    if (pos.raiderChest) return pos.raiderChest
    return null
}
function findEmptySlot(be) {
    for (let i = 0; i < be.getContainerSize(); i++) {
        if (be.getItem(i).isEmpty()) return i
    }
    return -1
}
function depositStackToContainer(be, id, count) {
    let maxStack = 64
    try {
        let probe = Item.of(id)
        if (probe && probe.getMaxStackSize) maxStack = probe.getMaxStackSize()
    } catch (e) {}
    for (let i = 0; i < be.getContainerSize() && count > 0; i++) {
        let s = be.getItem(i)
        if (!s.isEmpty() && s.id === id && s.count < maxStack) {
            let add = Math.min(maxStack - s.count, count)
            be.setItem(i, Item.of(id, s.count + add))
            count -= add
        }
    }
    while (count > 0) {
        let slot = findEmptySlot(be)
        if (slot === -1) break
        let put = Math.min(maxStack, count)
        be.setItem(slot, Item.of(id, put))
        count -= put
    }
    return count
}
function removeFromContainer(be, id, count) {
    if (!be) return 0
    let removed = 0
    for (let i = 0; i < be.getContainerSize() && removed < count; i++) {
        let s = be.getItem(i)
        if (!s.isEmpty() && !s.isEnchanted() && s.id === id) {
            let take = Math.min(s.count, count - removed)
            if (take >= s.count) be.setItem(i, $ItemStack.EMPTY)
            else be.setItem(i, Item.of(id, s.count - take))
            removed += take
        }
    }
    return removed
}
function removeFromStorage(level, pos, id, count) {
    let removed = 0
    for (let be of getStorageContainers(level, pos)) {
        if (removed >= count) break
        removed += removeFromContainer(be, id, count - removed)
    }
    return removed
}
function getChestInvMap(level, pos) {
    let map = {}
    for (let chest of getStorageContainers(level, pos)) {
        for (let i = 0; i < chest.getContainerSize(); i++) {
            let s = chest.getItem(i)
            if (!s.isEmpty() && !s.isEnchanted()) map[s.id] = (map[s.id] || 0) + s.count
        }
    }
    return map
}

// ---------- 物品分类 ----------
const goetyMaterials = [
    'goety:cursed_ingot', 'goety:cursed_metal_block',
    'goety:pale_steel_ingot', 'goety:pale_steel_block',
    'goety:empty_focus', 'goety:magic_emerald', 'goety:soul_emerald',
    'goety:pulverize_focus'
]
const amethystItems = ['minecraft:amethyst_shard', 'minecraft:amethyst_block']
const cropItemIds = [
    'minecraft:wheat', 'minecraft:carrot', 'minecraft:potato', 'minecraft:beetroot',
    'farmersdelight:cabbage', 'farmersdelight:onion', 'farmersdelight:tomato', 'farmersdelight:rice',
    'minecraft:nether_wart', 'goety:snap_fungus', 'goety:snap_warts'
]
function itemHasTag(id, tag) {
    try {
        let s = Item.of(id)
        if (!s || s.isEmpty()) return false
        if (typeof s.hasTag === 'function') {
            try { if (s.hasTag(tag)) return true } catch (e) {}
        }
        if (typeof s.getTags === 'function') {
            let tags = s.getTags()
            if (tags) for (let t of tags) if (String(t) === tag) return true
        }
    } catch (e) {}
    return false
}
function isToolWeapon(id) {
    return id.indexOf('sword') !== -1 || id.indexOf('pickaxe') !== -1 || id.indexOf('axe') !== -1 ||
        id.indexOf('shovel') !== -1 || id.indexOf('hoe') !== -1 || id.indexOf('bow') !== -1
}
function isArmor(id) {
    return id.indexOf('helmet') !== -1 || id.indexOf('chestplate') !== -1 ||
        id.indexOf('leggings') !== -1 || id.indexOf('boots') !== -1
}
const categoryCache = {}
function categoryOf(id) {
    if (categoryCache[id] !== undefined) return categoryCache[id]
    let cat
    if (goetyMaterials.indexOf(id) !== -1) cat = 'goety'
    else if (isToolWeapon(id)) cat = 'tool'
    else if (isArmor(id)) cat = 'armor'
    else if (id.indexOf('_seeds') !== -1 || itemHasTag(id, 'forge:seeds')) cat = 'seed'
    else if (cropItemIds.indexOf(id) !== -1 || itemHasTag(id, 'forge:crops')) cat = 'crop'
    else if (itemHasTag(id, 'forge:foods')) cat = 'food'
    else if (amethystItems.indexOf(id) !== -1 ||
        itemHasTag(id, 'forge:nuggets') || itemHasTag(id, 'forge:ingots') ||
        itemHasTag(id, 'forge:gems') || itemHasTag(id, 'forge:storage_blocks') ||
        itemHasTag(id, 'forge:ores') || itemHasTag(id, 'forge:raw_materials') ||
        itemHasTag(id, 'forge:dusts')) cat = 'mineral'
    else cat = 'item:' + id
    categoryCache[id] = cat
    return cat
}
function rankContainer(be, id, cat) {
    let hasSame = false, hasCat = false, hasOther = false, isEmpty = true
    for (let i = 0; i < be.getContainerSize(); i++) {
        let s = be.getItem(i)
        if (s.isEmpty()) continue
        isEmpty = false
        if (s.id === id) hasSame = true
        else if (categoryOf(s.id) === cat) hasCat = true
        else hasOther = true
    }
    if (hasSame) return 0
    if (hasCat) return 1
    if (isEmpty) return 2
    if (hasOther) return 3
    return 4
}
function depositToStorage(level, pos, id, count) {
    let containers = getStorageContainers(level, pos)
    if (containers.length === 0) return count
    let cat = categoryOf(id)
    containers.sort((a, b) => rankContainer(a, id, cat) - rankContainer(b, id, cat))
    for (let be of containers) {
        if (count <= 0) break
        count = depositStackToContainer(be, id, count)
    }
    return count
}

// ---------- 仆从命名 ----------
const servantFirstNameCount = 55
const servantLastNameCount = 55
const servantNameCount = servantFirstNameCount * servantLastNameCount
function servantNameParts(idx) {
    let i = Math.abs(idx) % servantNameCount
    return { first: Math.floor(i / servantLastNameCount), last: i % servantLastNameCount }
}
function servantFullName(idx, titleIdx) {
    let p = servantNameParts(idx)
    let parts = [
        Text.translatable('requiem.servant.first_name.' + p.first),
        Text.of(' '),
        Text.translatable('requiem.servant.last_name.' + p.last)
    ]
    if (titleIdx !== undefined && titleIdx !== null && titleIdx >= 0) {
        parts = [Text.translatable('requiem.servant.title.' + titleIdx), Text.of(' ')].concat(parts)
    }
    return Text.join(parts)
}
const recruiterTitles = [
    { weight: 10 }, { weight: 9 }, { weight: 7 }, { weight: 6 }, { weight: 5 }, { weight: 3 },
    { weight: 10 }, { weight: 9 }, { weight: 8 }, { weight: 7 }, { weight: 5 }, { weight: 4 },
    { weight: 3 }, { weight: 2 }, { weight: 2 }
]
function pickRecruiterTitle() {
    let total = 0
    for (let t of recruiterTitles) total += t.weight
    let r = Math.random() * total
    let acc = 0
    for (let i = 0; i < recruiterTitles.length; i++) {
        acc += recruiterTitles[i].weight
        if (r < acc) return i
    }
    return 0
}
function getOwnerId(entity) {
    try {
        let o = entity.getTrueOwner()
        return o ? o.id : -1
    } catch (e) { return -1 }
}
function assignServantName(entity) {
    if (entity.persistentData.contains('ServantNameIndex')) return
    let ownerId = getOwnerId(entity)
    let used = {}
    if (ownerId >= 0) {
        let aabb = new $AABB(entity.x - 256, entity.y - 256, entity.z - 256, entity.x + 256, entity.y + 256, entity.z + 256)
        for (let e of entity.level.getEntitiesWithin(aabb)) {
            if (!isWorkServant(e)) continue
            if (e === entity) continue
            if (getOwnerId(e) === ownerId) {
                used[e.persistentData.getInt('ServantNameIndex')] = true
            }
        }
    }
    let idx = Math.floor(Math.random() * servantNameCount)
    let probe = 0
    while (used[idx] && probe < servantNameCount) {
        idx = (idx + 1) % servantNameCount
        probe++
    }
    entity.persistentData.putInt('ServantNameIndex', idx)
    let titleIdx = -1
    if (entity.type === 'requiem:recruiter') {
        titleIdx = pickRecruiterTitle()
        entity.persistentData.putInt('ServantTitleIndex', titleIdx)
    } else if (entity.type === 'requiem:artillery') {
        titleIdx = 15
        entity.persistentData.putInt('ServantTitleIndex', titleIdx)
    } else if (entity.type === 'requiem:grenadier') {
        titleIdx = 16
        entity.persistentData.putInt('ServantTitleIndex', titleIdx)
    } else if (entity.type === 'requiem:artillery_captain') {
        // 炮兵队长：炮兵上尉/中尉/少尉
        titleIdx = 17 + Math.floor(Math.random() * 3)
        entity.persistentData.putInt('ServantTitleIndex', titleIdx)
    }
    try {
        entity.setCustomName(servantFullName(idx, titleIdx))
        entity.setCustomNameVisible(true)
    } catch (e) {}
}
function servantTypeName(entity) {
    if (entity.type === 'requiem:gardener') return '园丁'
    if (entity.type === 'requiem:recruiter') return '征兵官'
    if (entity.type === 'requiem:artillery') return '炮兵'
    if (entity.type === 'requiem:artillery_hostile') return '敌对炮兵'
    if (entity.type === 'requiem:grenadier') return '掷弹兵'
    if (entity.type === 'requiem:grenadier_hostile') return '敌对掷弹兵'
    if (entity.type === 'requiem:conqueror') return '征服者'
    if (entity.type === 'requiem:artillery_captain') return '炮兵队长'
    return '学徒'
}
function servantLabel(entity) {
    let idx = entity.persistentData.getInt('ServantNameIndex')
    let titleIdx = entity.persistentData.contains('ServantTitleIndex') ? entity.persistentData.getInt('ServantTitleIndex') : -1
    let typeKey = 'requiem.servant.type.apprentice'
    if (entity.type === 'requiem:gardener') typeKey = 'requiem.servant.type.gardener'
    else if (entity.type === 'requiem:recruiter') typeKey = 'requiem.servant.type.recruiter'
    else if (entity.type === 'requiem:artillery') typeKey = 'requiem.servant.type.artillery'
    else if (entity.type === 'requiem:artillery_hostile') typeKey = 'requiem.servant.type.artillery_hostile'
    else if (entity.type === 'requiem:grenadier') typeKey = 'requiem.servant.type.grenadier'
    else if (entity.type === 'requiem:grenadier_hostile') typeKey = 'requiem.servant.type.grenadier_hostile'
    else if (entity.type === 'requiem:conqueror') typeKey = 'requiem.servant.type.conqueror'
    else if (entity.type === 'requiem:artillery_captain') typeKey = 'requiem.servant.type.artillery_captain'
    return Text.join([Text.translatable(typeKey), Text.of('·'), servantFullName(idx, titleIdx)])
}

// ---------- 反馈 ----------
function servantInfoEnabled(player) {
    try {
        if (player.persistentData.contains('servantInfo')) {
            return player.persistentData.getBoolean('servantInfo')
        }
        return true
    } catch (e) { return true }
}
function tellOwner(entity, task) {
    let owner = entity.getTrueOwner()
    if (!owner || !owner.isPlayer()) return
    if (!servantInfoEnabled(owner)) return
    if (typeof task === 'string') {
        owner.tell(Text.join([Text.of('§7['), servantLabel(entity), Text.of('] ' + task)]))
    } else {
        owner.tell(Text.join([Text.of('§7['), servantLabel(entity), Text.of('] '), task]))
    }
}
function setTask(entity, task) {
    if (entity.persistentData.getString('currentTask') === task) return
    entity.persistentData.putString('currentTask', task)
}
function debugItem(entity, msg) {
    let owner = entity.getTrueOwner()
    if (!owner || !owner.isPlayer()) return
    if (!servantInfoEnabled(owner)) return
    if (typeof msg === 'string') {
        owner.tell(Text.join([Text.of('§b['), servantLabel(entity), Text.of('] ' + msg)]))
    } else {
        owner.tell(Text.join([Text.of('§b['), servantLabel(entity), Text.of('] '), msg]))
    }
}
function setHeldItem(entity, id) {
    if (!id) return
    try { entity.setMainHandItem(Item.of(id)) } catch (e) {}
}
function formatInv(inv) {
    let parts = []
    for (let id in inv) {
        if (inv[id] > 0) parts.push(id + ' x' + inv[id])
    }
    return parts.length ? parts.join(', ') : '空'
}

// ---------- 需求系统 ----------
const DEMAND_COOLDOWN = 40
const materialProviderMap = {
    'crop': ['requiem:gardener'],
    'seed': ['requiem:gardener'],
    'food': ['requiem:gardener'],
    'mineral': ['requiem:apprentice'],
    'goety': ['requiem:apprentice'],
    'tool': ['requiem:apprentice'],
    'armor': ['requiem:apprentice']
}
function isWorkServant(e) {
    return e.type === 'requiem:apprentice' || e.type === 'requiem:gardener' || e.type === 'requiem:recruiter'
}
function canProvideItem(item, servantType) {
    let cat = categoryOf(item)
    let providers = materialProviderMap[cat]
    if (!providers) return true
    return providers.indexOf(servantType) !== -1
}
function canProvideAny(items, servantType) {
    for (let item of items) if (canProvideItem(item, servantType)) return true
    return false
}
function getDemands(entity) {
    try {
        let s = entity.persistentData.getString('demands')
        return s ? JSON.parse(s) : []
    } catch (e) {
        entity.persistentData.putString('demands', '')
        return []
    }
}
function setDemands(entity, arr) {
    entity.persistentData.putString('demands', JSON.stringify(arr))
}
function requestMaterials(entity, goal, items) {
    items = (items || []).filter(x => x != null)
    if (items.length === 0) return
    let demands = getDemands(entity)
    for (let d of demands) {
        if (d.goal === goal) {
            if ((d.items || []).join('|') !== items.join('|')) {
                d.items = items.slice()
            }
            setDemands(entity, demands)
            return
        }
    }
    demands.push({ goal: goal, items: items.slice(), exclude: [entity.id], retryTick: 0 })
    setDemands(entity, demands)
}
function requestMaterial(entity, item) {
    requestMaterials(entity, item, [item])
}
function clearDemand(entity) {
    setDemands(entity, [])
}
function cleanupDemands(entity, inv, pos) {
    let demands = getDemands(entity)
    if (demands.length === 0) return
    let chestInv = getChestInvMap(entity.level, pos)
    demands = demands.filter(d => {
        let goal = d.goal
        if (!goal) return false
        let missing = global.findMissingMaterials(inv, chestInv, goal, 1, 0, [], [], true)
        return missing.length > 0
    })
    setDemands(entity, demands)
}
function spawnDemandParticles(entity, happy) {
    try {
        let p = happy ? $ParticleTypes.HAPPY_VILLAGER : $ParticleTypes.ANGRY_VILLAGER
        entity.level.spawnParticles(p, true, entity.x, entity.y + 1, entity.z, 0.4, 0.5, 0.4, 6, 0.05)
    } catch (e) {}
}
function processDemand(entity, inv) {
    let demands = getDemands(entity)
    if (demands.length === 0) return false
    let level = entity.level
    let now = servantClock
    demands.sort((a, b) => (a.retryTick || 0) - (b.retryTick || 0))
    let d = demands[0]
    let items = (d.items || (d.item ? [d.item] : [])).filter(x => x != null)
    if (now < (d.retryTick || 0)) return false
    let aabb = new $AABB(entity.x - 16, entity.y - 16, entity.z - 16, entity.x + 16, entity.y + 16, entity.z + 16)
    let candidates = []
    for (let e of level.getEntitiesWithin(aabb)) {
        if (!isWorkServant(e)) continue
        if (e.id === entity.id) continue
        if (d.exclude.indexOf(e.id) !== -1) continue
        if (!canProvideAny(items, e.type)) continue
        candidates.push(e)
    }
    if (candidates.length === 0) {
        spawnDemandParticles(entity, false)
        tellOwner(entity, '需求 ' + items.join('/') + ' 失败：附近 16 格内无其他可提供的工作仆从')
        d.retryTick = now + DEMAND_COOLDOWN
        d.exclude = [entity.id]
        setDemands(entity, demands)
        return false
    }
    candidates.sort((a, b) => {
        let da = (a.x - entity.x) * (a.x - entity.x) + (a.y - entity.y) * (a.y - entity.y) + (a.z - entity.z) * (a.z - entity.z)
        let db = (b.x - entity.x) * (b.x - entity.x) + (b.y - entity.y) * (b.y - entity.y) + (b.z - entity.z) * (b.z - entity.z)
        return da - db
    })
    let provider = candidates[0]
    let dx = entity.x - provider.x, dy = entity.y - provider.y, dz = entity.z - provider.z
    if (dx * dx + dy * dy + dz * dz > WORK_DIST_SQ) {
        entity.navigation.moveTo(provider.x, provider.y, provider.z, 1.0)
        setTask(entity, '向 ' + servantTypeName(provider) + ' 请求 ' + items.join('/') + '（前往查阅其背包与仓库）')
        return true
    }
    let pinv = readInv(provider)
    let providerPos = readPositions(provider)
    let chestInv = getChestInvMap(level, providerPos)
    let given = null
    let fromInv = false
    let crafted = false
    for (let item of items) {
        if ((pinv[item] || 0) > 0) { given = item; fromInv = true; break }
        if ((chestInv[item] || 0) > 0) { given = item; fromInv = false; break }
    }
    if (!given) {
        for (let item of items) {
            let missing = global.findMissingMaterials(pinv, chestInv, item, 1, 0, [], [], true)
            if (missing.length === 0) {
                let plan = global.planGetItem(pinv, chestInv, item, 1, 0, [], true)
                if (plan && plan.length) {
                    for (let step of plan) global.executeStep(provider, pinv, providerPos, step)
                    writeInv(provider, pinv)
                    given = item
                    fromInv = true
                    crafted = true
                    break
                }
            }
        }
    }
    if (given) {
        if (fromInv) {
            removeInv(pinv, given, 1)
            writeInv(provider, pinv)
            tellOwner(entity, Text.join([Text.of('从 '), servantLabel(provider), Text.of(' 取得 ' + given + (crafted ? '（其合成有货）' : '（其背包有货）'))]))
        } else {
            removeFromStorage(level, providerPos, given, 1)
            tellOwner(entity, Text.join([Text.of('从 '), servantLabel(provider), Text.of(' 取得 ' + given + '（其仓库有货）')]))
        }
        addInv(inv, given, 1)
        spawnDemandParticles(entity, true)
        spawnDemandParticles(provider, true)
        demands.splice(0, 1)
        setDemands(entity, demands)
        return false
    } else {
        spawnDemandParticles(entity, false)
        spawnDemandParticles(provider, false)
        tellOwner(entity, Text.join([servantLabel(provider), Text.of(' 无 ' + items.join('/') + '（已查阅其背包与仓库）')]))
        d.exclude.push(provider.id)
        d.retryTick = now + DEMAND_COOLDOWN
        setDemands(entity, demands)
        return true
    }
}

// ---------- 拾取地面物品 ----------
function collectGroundItems(entity, inv) {
    let level = entity.level
    let aabb = new $AABB(entity.x - 3, entity.y - 1, entity.z - 3, entity.x + 3, entity.y + 3, entity.z + 3)
    let list = level.getEntitiesWithin(aabb)
    let did = []
    let count = 0
    for (let e of list) {
        if (e.type === 'minecraft:item') {
            let stack = e.item
            if (stack && stack.count > 0) {
                addInv(inv, stack.id, stack.count)
                did.push(stack.count + 'x ' + stack.id)
                count += stack.count
            }
            e.discard()
        }
    }
    if (did.length) debugItem(entity, '捡起 ' + did.join(', '))
    return count
}
function collectNearbyItems(level, inv, pos, did) {
    let x = pos[0] + 0.5, y = pos[1] + 0.5, z = pos[2] + 0.5
    let aabb = new $AABB(x - 3, y - 3, z - 3, x + 3, y + 3, z + 3)
    let list = level.getEntitiesWithin(aabb)
    let count = 0
    for (let e of list) {
        if (e.type === 'minecraft:item') {
            let stack = e.item
            if (stack && stack.count > 0) {
                addInv(inv, stack.id, stack.count)
                did.push('拾取 ' + stack.count + 'x ' + stack.id)
                count += stack.count
            }
            e.discard()
        }
    }
    return count
}
function hasNearbyItems(level, pos) {
    let x = pos[0] + 0.5, y = pos[1] + 0.5, z = pos[2] + 0.5
    let aabb = new $AABB(x - 3, y - 3, z - 3, x + 3, y + 3, z + 3)
    let list = level.getEntitiesWithin(aabb)
    for (let e of list) {
        if (e.type === 'minecraft:item') return true
    }
    return false
}

// ---------- 调试任务名 ----------
const taskNames = {
    'hopper': '从漏斗取物',
    'chest': '箱子存取',
    'raiderChest': '袭击者箱子存取',
    'barrels': '木桶存取',
    'furnaces': '熔炉烧炼',
    'workstation': '工作台合成',
    'enchantingTable': '附魔',
    'polish': '打磨宝石',
    'cursedInfuser': '使用诅咒注入器',
    'composter': '使用堆肥桶',
    'idle': '空闲',
    'follow': '跟随主人'
}

// ============================================================
//  事件分发
// ============================================================
let apprenticeTick = 0
let servantClock = 0
ServerEvents.tick(event => {
    servantClock++
    apprenticeTick++
    if (apprenticeTick % 20 !== 0) return
    apprenticeTick = 0
    event.server.entities.forEach(entity => {
        try {
            if (entity.type === 'requiem:apprentice') {
                try { if (entity.isMagic()) entity.setMagic(false) } catch (e) {}
                global.apprenticeAI(entity)
            } else if (entity.type === 'requiem:gardener') {
                global.gardenerAI(entity)
            } else if (entity.type === 'requiem:recruiter') {
                global.recruiterAI(entity)
            } else if (entity.type === 'requiem:artillery' || entity.type === 'requiem:artillery_hostile') {
                global.artilleryAI(entity)
            } else if (entity.type === 'requiem:grenadier' || entity.type === 'requiem:grenadier_hostile') {
                global.grenadierAI(entity)
            } else if (entity.type === 'requiem:artillery_captain') {
                global.artilleryCaptainAI(entity)
            }
        } catch (e) {}
    })
})

EntityEvents.spawned(event => {
    let entity = event.entity
    let hostile = entity.type === 'requiem:artillery_hostile' || entity.type === 'requiem:grenadier_hostile'
    let isServant = entity.type === 'requiem:apprentice' || entity.type === 'requiem:gardener' ||
        entity.type === 'requiem:recruiter' || entity.type === 'requiem:artillery' ||
        entity.type === 'requiem:grenadier' || entity.type === 'requiem:conqueror' ||
        entity.type === 'requiem:artillery_captain'
    if (!isServant && !hostile) return
    if (hostile) {
        // 敌对炮兵/掷弹兵：不绑主人，转为敌对
        try { entity.setHostile(true) } catch (e) {}
    } else if (!entity.getTrueOwner()) {
        // 己方仆从：绑定最近玩家
        let nearest = null
        let nearestDist = 1024
        for (let player of entity.server.players) {
            let dx = player.x - entity.x, dy = player.y - entity.y, dz = player.z - entity.z
            let d = dx * dx + dy * dy + dz * dz
            if (d < nearestDist) { nearestDist = d; nearest = player }
        }
        if (nearest) {
            entity.setTrueOwner(nearest)
            entity.setHostile(false)
        }
    }
    // 随机命名
    assignServantName(entity)
    // 统一服装 / 武器
    try { if (entity.isMagic()) entity.setMagic(false) } catch (e) {}
    if (entity.type === 'requiem:artillery' || entity.type === 'requiem:artillery_hostile') {
        // 炮兵：开火姿态持火把（近战时由 artilleryAI 切换为剑）
        try { entity.setMainHandItem(Item.of('minecraft:torch')) } catch (e) {}
    } else if (entity.type === 'requiem:grenadier' || entity.type === 'requiem:grenadier_hostile') {
        try { entity.setMainHandItem(Item.of('supplementaries:bomb')) } catch (e) {}
    } else if (entity.type === 'requiem:conqueror') {
        try { entity.setMainHandItem(Item.of('minecraft:crossbow')) } catch (e) {}
    } else if (entity.type === 'requiem:artillery_captain') {
        // 队长横幅（头部槽位），使 goety 的 isLeader() 成立
        try { entity.setHeadArmorItem(Item.of('minecraft:white_banner')) } catch (e) {}
    }
})

// 找附近最近的炮兵队长
function findNearestArtilleryCaptain(level, entity) {
    let aabb = new $AABB(entity.x - 32, entity.y - 32, entity.z - 32, entity.x + 32, entity.y + 32, entity.z + 32)
    let best = null
    let bestD = 32 * 32
    for (let e of level.getEntitiesWithin(aabb)) {
        if (e.type !== 'requiem:artillery_captain') continue
        let dx = e.x - entity.x, dy = e.y - entity.y, dz = e.z - entity.z
        let d = dx * dx + dy * dy + dz * dz
        if (d < bestD) { bestD = d; best = e }
    }
    return best
}

// 黑暗魔杖把炮兵编入炮兵队长的小队；非炮兵失败冒愤怒粒子
function tryAddToArtillerySquad(entity, player) {
    if (entity.type !== 'requiem:artillery') {
        player.tell('只有炮兵才能编入炮兵小队')
        spawnDemandParticles(entity, false)
        return
    }
    let captain = findNearestArtilleryCaptain(entity.level, entity)
    if (!captain) {
        player.tell('附近没有炮兵队长')
        spawnDemandParticles(entity, false)
        return
    }
    try {
        entity.setLeader(captain)
        let leaderAfter = entity.getLeader()
        console.log('[炮兵DBG] 魔杖编队 setLeader 后 getLeader=' + (leaderAfter ? String(leaderAfter.type) : 'null'))
    } catch (e) {
        console.log('[炮兵DBG] 魔杖编队 setLeader 异常: ' + e)
    }
    try { entity.persistentData.putBoolean('inArtillerySquad', true) } catch (e) {}
    try { entity.persistentData.putString('artilleryCaptainUuid', String(captain.uuid)) } catch (e) {console.log(`[LINE 750]方法调用失败`)}
    player.tell(Text.join([Text.of('已把炮兵编入 '), servantLabel(captain), Text.of(' 的小队')]))
}

ItemEvents.entityInteracted(event => {
    let entity = event.getTarget()
    if (!entity) return
    let player = event.player
    if (!player || player.level.isClientSide()) return
    console.log('[炮兵DBG] entityInteracted 目标=' + entity.type + ' 手持=' + player.mainHandItem.id)
    if (entity.type === 'requiem:apprentice') {
        global.apprenticeInteract({ entity: entity, player: player })
    } else if (entity.type === 'requiem:gardener') {
        global.gardenerInteract({ entity: entity, player: player })
    } else if (entity.type === 'requiem:recruiter') {
        global.recruiterInteract({ entity: entity, player: player })
    } else if (entity.type === 'requiem:artillery' || entity.type === 'requiem:artillery_hostile') {
        global.artilleryInteract({ entity: entity, player: player })
    } else if (entity.type === 'requiem:artillery_captain') {
        global.artilleryCaptainInteract({ entity: entity, player: player })
    }
})

// 右键空中（手持炮射地图）：把视线指向的方块坐标写入地图
function traceStrikeTarget(player) {
    let held = player.mainHandItem
    if (!held || held.id !== 'kubejs:strike_map') return
    let rt = player.rayTrace(256)
    if (!rt || !rt.block) {
        player.tell('视线内没有目标方块')
        return
    }
    let x = rt.block.x, y = rt.block.y, z = rt.block.z
    let nbt = held.getOrCreateTag()
    nbt.putInt('strikeX', x)
    nbt.putInt('strikeY', y)
    nbt.putInt('strikeZ', z)
    player.tell('已设置打击坐标 (' + x + ',' + y + ',' + z + ')')
}

ItemEvents.rightClicked(event => {
    let player = event.player
    if (!player || player.level.isClientSide()) return
    if (player.mainHandItem.id !== 'kubejs:strike_map') return
    traceStrikeTarget(player)
    try { event.cancel() } catch (e) {}
})

// 右键方块：列表物品记录位置
BlockEvents.rightClicked(event => {
    let player = event.player
    if (!player || player.level.isClientSide()) return
    let held = player.mainHandItem
    if (held.id === 'kubejs:strike_map') {
        traceStrikeTarget(player)
        try { event.cancel() } catch (e) {}
    } else if (held.id === 'kubejs:smelt_list') {
        let bid = event.block.id
        if (bid === 'minecraft:furnace' || bid === 'minecraft:blast_furnace' || bid === 'minecraft:smoker') {
            let arr = addListPosition(held, [event.block.x, event.block.y, event.block.z])
            player.tell('已记录熔炉，共 ' + arr.length + ' 个')
            try { event.cancel() } catch (e) {}
        }
    } else if (held.id === 'kubejs:store_list') {
        if (event.block.id === 'minecraft:barrel') {
            let arr = addListPosition(held, [event.block.x, event.block.y, event.block.z])
            player.tell('已记录木桶，共 ' + arr.length + ' 个')
            try { event.cancel() } catch (e) {}
        }
    } else if (held.id === 'kubejs:torch_list') {
        if (event.block.id === 'goety:ominous_pyre') {
            let arr = addListPosition(held, [event.block.x, event.block.y, event.block.z])
            player.tell('已记录不祥火炬，共 ' + arr.length + ' 个')
            try { event.cancel() } catch (e) {}
        }
    }
})

// 敲击 desk_bell：强制周围仆从重跑一次需求检测
BlockEvents.rightClicked(event => {
    if (event.block.id !== 'create:desk_bell') return
    let player = event.player
    if (!player || player.level.isClientSide()) return
    let level = player.level
    let aabb = new $AABB(event.block.x - 32, event.block.y - 32, event.block.z - 32, event.block.x + 32, event.block.y + 32, event.block.z + 32)
    let count = 0
    for (let e of level.getEntitiesWithin(aabb)) {
        if (!isWorkServant(e)) continue
        clearDemand(e)
        count++
    }
    if (count > 0) player.tell('§e已强制 ' + count + ' 个工作仆从重新检测需求')
})

// ---------- 命令 ----------
ServerEvents.commandRegistry(event => {
    const { commands, arguments: args } = event
    event.register(
        commands.literal('requiem')
            .then(commands.literal('debug')
                .then(commands.literal('requests')
                    .executes(ctx => {
                        let player = ctx.source.player
                        if (!player) return 0
                        let found = []
                        let aabb = new $AABB(player.x - 32, player.y - 32, player.z - 32, player.x + 32, player.y + 32, player.z + 32)
                        for (let e of player.level.getEntitiesWithin(aabb)) {
                            if (!isWorkServant(e)) continue
                            let demands = getDemands(e)
                            for (let d of demands) {
                                let items = (d.items || (d.item ? [d.item] : [])).filter(x => x != null)
                                found.push(Text.join([servantLabel(e), Text.of(': 请求 ' + items.join('/'))]))
                            }
                        }
                        if (found.length === 0) {
                            ctx.source.sendSuccess(Text.of('附近没有工作类仆从的需求'), false)
                        } else {
                            for (let line of found) {
                                ctx.source.sendSuccess(Text.join([Text.of('§6[需求] §r'), line]), false)
                            }
                        }
                        return 1
                    })))
            .then(commands.literal('toggle')
                .then(commands.literal('info')
                    .executes(ctx => {
                        let player = ctx.source.player
                        if (!player) return 0
                        let cur = servantInfoEnabled(player)
                        player.persistentData.putBoolean('servantInfo', !cur)
                        ctx.source.sendSuccess(Text.of('§e仆从反馈已' + (cur ? '关闭' : '开启')), false)
                        return 1
                    })))
            .then(commands.literal('strike')
                .then(commands.argument('x', args.INTEGER.create(event))
                    .then(commands.argument('y', args.INTEGER.create(event))
                        .then(commands.argument('z', args.INTEGER.create(event))
                            .executes(ctx => {
                                let player = ctx.source.player
                                if (!player) return 0
                                let held = player.mainHandItem
                                if (held.id !== 'kubejs:strike_map') {
                                    player.tell('需要手持炮射地图')
                                    return 0
                                }
                                let x = args.INTEGER.getResult(ctx, 'x')
                                let y = args.INTEGER.getResult(ctx, 'y')
                                let z = args.INTEGER.getResult(ctx, 'z')
                                let nbt = held.getOrCreateTag()
                                nbt.putInt('strikeX', x)
                                nbt.putInt('strikeY', y)
                                nbt.putInt('strikeZ', z)
                                player.tell('已设置打击坐标 (' + x + ',' + y + ',' + z + ')')
                                return 1
                            })))))
    )
})

// ---------- 命令：查看最近学徒的背包 ----------
ServerEvents.commandRegistry(event => {
    const { commands } = event
    event.register(
        commands.literal('apprentice_inv')
            .executes(ctx => {
                let player = ctx.source.player
                if (!player) return 0
                let nearest = null
                let nearestDist = 1024
                player.server.entities.forEach(entity => {
                    if (entity.type !== 'requiem:apprentice') return
                    let dx = player.x - entity.x
                    let dy = player.y - entity.y
                    let dz = player.z - entity.z
                    let d = dx * dx + dy * dy + dz * dz
                    if (d < nearestDist) {
                        nearestDist = d
                        nearest = entity
                    }
                })
                if (!nearest) {
                    ctx.source.sendSuccess(Text.of('附近没有学徒'), false)
                    return 1
                }
                ctx.source.sendSuccess(Text.of('[学徒背包] ' + formatInv(readInv(nearest))), false)
                return 1
            })
    )
})

// ============================================================
//  挂载到 global
// ============================================================
function exportG(map) {
    for (let k in map) global[k] = map[k]
}
exportG({
    $WaystoneItem: $WaystoneItem, $EnchantmentHelper: $EnchantmentHelper, $ItemStack: $ItemStack,
    $AABB: $AABB, $ComposterBlock: $ComposterBlock, $ParticleTypes: $ParticleTypes,
    WORK_DIST_SQ: WORK_DIST_SQ, FURNACE_OUTPUT_THRESHOLD: FURNACE_OUTPUT_THRESHOLD,
    readInv: readInv, writeInv: writeInv, addInv: addInv, removeInv: removeInv, findInv: findInv,
    readPositions: readPositions, writePositions: writePositions, getContainerAt: getContainerAt,
    drainContainerSlot: drainContainerSlot,
    listPositions: listPositions, setListPositions: setListPositions, addListPosition: addListPosition,
    getStorageContainers: getStorageContainers, getStorageChest: getStorageChest,
    firstStoragePos: firstStoragePos, findEmptySlot: findEmptySlot,
    depositStackToContainer: depositStackToContainer, depositToStorage: depositToStorage,
    removeFromContainer: removeFromContainer, removeFromStorage: removeFromStorage,
    getChestInvMap: getChestInvMap,
    goetyMaterials: goetyMaterials, amethystItems: amethystItems, cropItemIds: cropItemIds,
    itemHasTag: itemHasTag, isToolWeapon: isToolWeapon, isArmor: isArmor, categoryOf: categoryOf,
    rankContainer: rankContainer,
    servantFirstNameCount: servantFirstNameCount, servantLastNameCount: servantLastNameCount,
    servantNameCount: servantNameCount, servantNameParts: servantNameParts, servantFullName: servantFullName,
    recruiterTitles: recruiterTitles, pickRecruiterTitle: pickRecruiterTitle, getOwnerId: getOwnerId,
    assignServantName: assignServantName, servantTypeName: servantTypeName, servantLabel: servantLabel,
    servantInfoEnabled: servantInfoEnabled, tellOwner: tellOwner, setTask: setTask, debugItem: debugItem,
    setHeldItem: setHeldItem, formatInv: formatInv,
    DEMAND_COOLDOWN: DEMAND_COOLDOWN, materialProviderMap: materialProviderMap, isWorkServant: isWorkServant,
    canProvideItem: canProvideItem, canProvideAny: canProvideAny,
    getDemands: getDemands, setDemands: setDemands, requestMaterials: requestMaterials,
    requestMaterial: requestMaterial, clearDemand: clearDemand, cleanupDemands: cleanupDemands,
    spawnDemandParticles: spawnDemandParticles, processDemand: processDemand,
    collectGroundItems: collectGroundItems, collectNearbyItems: collectNearbyItems, hasNearbyItems: hasNearbyItems,
    taskNames: taskNames
})
})();
