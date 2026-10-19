(function () {
// ============================================================
//  学徒：工业制造（合成/熔炼/附魔/采矿/农田基础设施）
//  共享给园丁的规划/农田/存储函数通过 global 导出
// ============================================================

const $WaystoneItem = Java.loadClass('com.Polarice3.Goety.common.items.WaystoneItem')
const $EnchantmentHelper = Java.loadClass('net.minecraft.world.item.enchantment.EnchantmentHelper')
const $ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')
const $ComposterBlock = Java.loadClass('net.minecraft.world.level.block.ComposterBlock')

const { readInv, writeInv, addInv, removeInv, findInv,
    readPositions, writePositions, getContainerAt,
    listPositions, setListPositions, addListPosition,
    getStorageContainers, getStorageChest, firstStoragePos, findEmptySlot,
    depositStackToContainer, depositToStorage, removeFromContainer, removeFromStorage, getChestInvMap,
    categoryOf, itemHasTag,
    servantFullName, getOwnerId, assignServantName, servantTypeName, servantLabel,
    servantInfoEnabled, tellOwner, setTask, debugItem, setHeldItem, formatInv,
    getDemands, setDemands, requestMaterials, requestMaterial, clearDemand, cleanupDemands,
    spawnDemandParticles, processDemand,
    isWorkServant, canProvideItem, canProvideAny,
    collectGroundItems, collectNearbyItems, hasNearbyItems,
    taskNames, WORK_DIST_SQ, FURNACE_OUTPUT_THRESHOLD
} = global

// 矿物块合成表（9 锭 -> 1 块）
const mineralBlocks = {
    'minecraft:iron_ingot': 'minecraft:iron_block',
    'minecraft:gold_ingot': 'minecraft:gold_block',
    'minecraft:diamond': 'minecraft:diamond_block',
    'minecraft:emerald': 'minecraft:emerald_block',
    'minecraft:lapis_lazuli': 'minecraft:lapis_block',
    'minecraft:copper_ingot': 'minecraft:copper_block',
    'minecraft:coal': 'minecraft:coal_block',
    'minecraft:redstone': 'minecraft:redstone_block',
    'minecraft:netherite_ingot': 'minecraft:netherite_block',
    'goety:cursed_ingot': 'goety:cursed_metal_block',
    'goety:pale_steel_ingot': 'goety:pale_steel_block',
    'kubejs:platinum_ingot': 'kubejs:platinum_block',
    'kubejs:lead_ingot': 'kubejs:lead_block',
    'kubejs:thorium_ingot': 'kubejs:thorium_block',
    'kubejs:plutonium_ingot': 'kubejs:plutonium_block',
    'kubejs:uranium_ingot': 'kubejs:pure_uranium_block'
}

// 砂纸打磨 rough gem -> 成品
const polishMap = {
    'spelunkery:rough_diamond': 'minecraft:diamond',
    'spelunkery:rough_emerald': 'minecraft:emerald',
    'spelunkery:rough_lazurite': 'minecraft:lapis_lazuli',
    'spelunkery:rough_cinnabar': 'spelunkery:cinnabar'
}

// 加工配方
const recipes = (function () {
    function o(item, count) {
        let r = {}
        r[item] = count
        return r
    }
    let list = []
    for (let ingot in mineralBlocks) {
        let block = mineralBlocks[ingot]
        list.push({ id: 'compress_' + ingot, in: o(ingot, 9), out: o(block, 1), at: 'workstation', name: '合成 ' + block })
        list.push({ id: 'decompose_' + block, in: o(block, 1), out: o(ingot, 9), at: 'workstation', name: '分解 ' + block })
    }
    list.push({ id: 'gold_ingot_to_nuggets', in: { 'minecraft:gold_ingot': 1 }, out: { 'minecraft:gold_nugget': 9 }, at: 'workstation', name: '分解金粒' })
    list.push({ id: 'gold_nuggets_to_ingot', in: { 'minecraft:gold_nugget': 9 }, out: { 'minecraft:gold_ingot': 1 }, at: 'workstation', name: '合成金锭' })
    list.push({ id: 'iron_ingot_to_nuggets', in: { 'minecraft:iron_ingot': 1 }, out: { 'minecraft:iron_nugget': 9 }, at: 'workstation', name: '分解铁粒' })
    list.push({ id: 'iron_nuggets_to_ingot', in: { 'minecraft:iron_nugget': 9 }, out: { 'minecraft:iron_ingot': 1 }, at: 'workstation', name: '合成铁锭' })
    list.push({ id: 'sandpaper', in: { 'minecraft:paper': 1, 'minecraft:sand': 1 }, out: { 'create:sand_paper': 1 }, at: 'workstation', name: '合成砂纸' })
    list.push({ id: 'rough_diamond_from_shards', in: { 'spelunkery:rough_diamond_shard': 9 }, out: { 'spelunkery:rough_diamond': 1 }, at: 'workstation', name: '合成粗钻石' })
    list.push({ id: 'snap_seed', in: { 'goety:snap_fungus': 1 }, out: { 'goety:snap_warts': 4 }, at: 'workstation', name: '合成砰砰菌种子' })
    list.push({ id: 'netherite', in: { 'minecraft:netherite_scrap': 4, 'minecraft:gold_ingot': 4 }, out: { 'minecraft:netherite_ingot': 1 }, at: 'workstation', name: '合成下界合金' })
    list.push({ id: 'sticks', in: { 'minecraft:oak_planks': 2 }, out: { 'minecraft:stick': 4 }, at: 'workstation', name: '合成木棍' })
    list.push({ id: 'glistering_melon', in: { 'minecraft:melon_slice': 1, 'minecraft:gold_nugget': 8 }, out: { 'minecraft:glistering_melon_slice': 1 }, at: 'workstation', name: '合成闪耀西瓜片' })
    list.push({ id: 'golden_carrot', in: { 'minecraft:carrot': 1, 'minecraft:gold_nugget': 8 }, out: { 'minecraft:golden_carrot': 1 }, at: 'workstation', name: '合成金胡萝卜' })
    list.push({ id: 'golden_apple', in: { 'minecraft:apple': 1, 'minecraft:gold_ingot': 8 }, out: { 'minecraft:golden_apple': 1 }, at: 'workstation', name: '合成金苹果' })
    list.push({ id: 'magma_cream', in: { 'minecraft:blaze_powder': 1, 'minecraft:slime_ball': 1 }, out: { 'minecraft:magma_cream': 1 }, at: 'workstation', name: '合成岩浆膏' })
    list.push({ id: 'fermented_spider_eye', in: { 'minecraft:spider_eye': 1, 'minecraft:brown_mushroom': 1, 'minecraft:sugar': 1 }, out: { 'minecraft:fermented_spider_eye': 1 }, at: 'workstation', name: '合成发酵蛛眼' })
    list.push({ id: 'blaze_powder', in: { 'minecraft:blaze_rod': 1 }, out: { 'minecraft:blaze_powder': 2 }, at: 'workstation', name: '合成烈焰粉' })
    list.push({ id: 'paper_from_sugarcane', in: { 'minecraft:sugar_cane': 1 }, out: { 'minecraft:paper': 1 }, at: 'workstation', name: '处理甘蔗为纸' })
    list.push({ id: 'sugar_from_sugarcane', in: { 'minecraft:sugar_cane': 1 }, out: { 'minecraft:sugar': 1 }, at: 'workstation', name: '处理甘蔗为糖' })
    list.push({ id: 'sugar_cane_block', in: { 'minecraft:sugar_cane': 9 }, out: { 'quark:sugar_cane_block': 1 }, at: 'workstation', name: '打包甘蔗块' })
    list.push({ id: 'iron_pickaxe', in: { 'minecraft:iron_ingot': 3, 'minecraft:stick': 2 }, out: { 'minecraft:iron_pickaxe': 1 }, at: 'workstation', name: '合成铁镐' })
    list.push({ id: 'pale_steel_pickaxe', in: { 'goety:pale_steel_ingot': 3, 'minecraft:stick': 2 }, out: { 'kubejs:pale_metal_pickaxe': 1 }, at: 'workstation', name: '合成苍白钢镐',
        make: () => Item.of('kubejs:pale_metal_pickaxe', '{Damage:0}').enchant('minecraft:unbreaking', 4).enchant('minecraft:efficiency', 3).enchant('minecraft:fortune', 4) })
    list.push({ id: 'cursed_ingot', in: { 'minecraft:iron_ingot': 1 }, out: { 'goety:cursed_ingot': 1 }, at: 'cursedInfuser', name: '注入诅咒锭' })
    list.push({ id: 'magic_emerald', in: { 'minecraft:emerald': 1 }, out: { 'goety:magic_emerald': 1 }, at: 'cursedInfuser', name: '注入魔法绿宝石' })
    list.push({ id: 'empty_focus', in: { 'minecraft:amethyst_shard': 1 }, out: { 'goety:empty_focus': 1 }, at: 'cursedInfuser', name: '注入空法术聚晶' })
    list.push({ id: 'wart_bread', in: { 'farmersdelight:wheat_dough': 1, 'minecraft:nether_wart': 1 }, out: { 'kubejs:wart_bread': 1 }, at: 'workstation', name: '合成下界面包' })
    list.push({ id: 'soul_emerald', in: { 'goety:magic_emerald': 8, 'goety:empty_focus': 1 }, out: { 'goety:soul_emerald': 1 }, at: 'workstation', name: '合成灵魂绿宝石' })
    list.push({ id: 'pale_steel_ingot', in: { 'goety:cursed_ingot': 1, 'minecraft:iron_ingot': 1, 'minecraft:lapis_lazuli': 1, 'minecraft:coal': 1 }, out: { 'goety:pale_steel_ingot': 2 }, at: 'workstation', name: '合成苍白钢锭' })
    list.push({ id: 'diamond_pickaxe', in: { 'minecraft:diamond': 3, 'minecraft:stick': 2 }, out: { 'minecraft:diamond_pickaxe': 1 }, at: 'workstation', name: '合成钻石镐' })
    list.push({ id: 'bucket', in: { 'minecraft:iron_ingot': 3 }, out: { 'minecraft:bucket': 1 }, at: 'workstation', name: '合成铁桶' })
    list.push({ id: 'fill_bucket', in: { 'minecraft:bucket': 1 }, out: { 'minecraft:water_bucket': 1 }, at: 'water', name: '装水' })
    list.push({ id: 'pulverize_focus', in: { 'goety:empty_focus': 1, 'minecraft:iron_block': 3, 'minecraft:oak_log': 1 }, out: { 'goety:pulverize_focus': 1 }, at: 'workstation', name: '合成瓦解聚晶' })
    list.push({ id: 'wheat_dough', in: { 'minecraft:water_bucket': 1, 'minecraft:wheat': 1 }, out: { 'farmersdelight:wheat_dough': 1, 'minecraft:bucket': 1 }, at: 'workstation', name: '合成面团' })
    list.push({ id: 'stone_to_cobblestone', in: { 'minecraft:stone': 1 }, tool: 'goety:pulverize_focus', out: { 'minecraft:cobblestone': 1 }, at: 'workstation', name: '粉碎石头' })
    list.push({ id: 'cobblestone_to_gravel', in: { 'minecraft:cobblestone': 1 }, tool: 'goety:pulverize_focus', out: { 'minecraft:gravel': 1 }, at: 'workstation', name: '粉碎圆石' })
    list.push({ id: 'gravel_to_sand', in: { 'minecraft:gravel': 1 }, tool: 'goety:pulverize_focus', out: { 'minecraft:sand': 1 }, at: 'workstation', name: '粉碎沙砾' })
    return list
})()

const pedestalTargets = {
    'goety:cursed_ingot': 'cursed_ingot',
    'goety:magic_emerald': 'magic_emerald',
    'goety:soul_emerald': 'soul_emerald',
    'goety:pale_steel_ingot': 'pale_steel_ingot',
    'minecraft:iron_pickaxe': 'iron_pickaxe',
    'minecraft:diamond_pickaxe': 'diamond_pickaxe',
    'kubejs:pale_metal_pickaxe': 'pale_steel_pickaxe',
    'farmersdelight:wheat_dough': 'wheat_dough',
    'minecraft:cobblestone': 'stone_to_cobblestone',
    'minecraft:gravel': 'cobblestone_to_gravel',
    'minecraft:sand': 'gravel_to_sand',
    'kubejs:wart_bread': 'wart_bread'
}

const smeltables = [
    'minecraft:iron_ore', 'minecraft:deepslate_iron_ore', 'minecraft:raw_iron',
    'minecraft:gold_ore', 'minecraft:deepslate_gold_ore', 'minecraft:raw_gold',
    'minecraft:copper_ore', 'minecraft:deepslate_copper_ore', 'minecraft:raw_copper',
    'minecraft:ancient_debris', 'minecraft:nether_gold_ore'
]

const smokerInputs = [
    'minecraft:beef', 'minecraft:porkchop', 'minecraft:chicken',
    'minecraft:mutton', 'minecraft:rabbit', 'minecraft:cod',
    'minecraft:salmon', 'minecraft:potato', 'minecraft:kelp'
]

const fuels = ['minecraft:coal', 'minecraft:charcoal', 'minecraft:coal_block']

const cursedInfuserInputs = [
    'minecraft:iron_ingot', 'minecraft:emerald', 'minecraft:calcite',
    'minecraft:amethyst_shard', 'minecraft:stone'
]

const FARM_RANGE = 8
const farmCrops = {
    'minecraft:nether_wart': { maxAge: 3, seed: 'minecraft:nether_wart', harvest: 'minecraft:nether_wart', keepHarvest: false },
    'goety:snap_warts': { maxAge: 2, seed: 'goety:snap_warts', harvest: 'goety:snap_fungus', keepHarvest: true }
}

const planterBlocks = ['supplementaries:planter', 'supplementaries:planter_rich']
const planterCrops = {
    'minecraft:wheat': { maxAge: 7, seed: 'minecraft:wheat_seeds' },
    'minecraft:carrots': { maxAge: 7, seed: 'minecraft:carrot' },
    'minecraft:potatoes': { maxAge: 7, seed: 'minecraft:potato' },
    'minecraft:beetroots': { maxAge: 3, seed: 'minecraft:beetroot_seeds' },
    'farmersdelight:cabbages': { maxAge: 7, seed: 'farmersdelight:cabbage_seeds' },
    'farmersdelight:onions': { maxAge: 7, seed: 'farmersdelight:onion' },
    'farmersdelight:tomatoes': { maxAge: 3, seed: 'farmersdelight:tomato_seeds' },
    'farmersdelight:rice_panicles': { maxAge: 3, seed: 'farmersdelight:rice' }
}
const planterSeedReserve = {
    'minecraft:wheat_seeds': 8,
    'minecraft:beetroot_seeds': 8,
    'farmersdelight:cabbage_seeds': 8,
    'farmersdelight:tomato_seeds': 8
}

const toolItems = ['minecraft:bucket', 'minecraft:water_bucket', 'goety:pulverize_focus']

const itemReserve = {
    'goety:snap_warts': 8,
    'minecraft:amethyst_shard': 16,
    'goety:pulverize_focus': 1
}
for (let s in planterSeedReserve) itemReserve[s] = planterSeedReserve[s]

const seedItems = [
    'minecraft:wheat_seeds',
    'minecraft:beetroot_seeds',
    'farmersdelight:cabbage_seeds',
    'farmersdelight:tomato_seeds',
    'minecraft:carrot',
    'minecraft:potato',
    'farmersdelight:onion',
    'farmersdelight:rice'
]

const roughGemShards = ['spelunkery:rough_diamond_shard']

function isBlastInput(id) { return smeltables.indexOf(id) !== -1 }
function isSmokerInput(id) { return smokerInputs.indexOf(id) !== -1 }
function isSmeltable(id) { return isBlastInput(id) || isSmokerInput(id) }
function furnaceTypeOf(level, p) {
    if (!p) return 'furnace'
    let bc = level.getBlock(p[0], p[1], p[2])
    if (!bc) return 'furnace'
    if (bc.id === 'minecraft:blast_furnace') return 'blast'
    if (bc.id === 'minecraft:smoker') return 'smoker'
    return 'furnace'
}
function findFurnaceInput(inv, type) {
    if (type === 'blast') {
        for (let id of smeltables) if ((inv[id] || 0) > 0) return id
    } else if (type === 'smoker') {
        for (let id of smokerInputs) if ((inv[id] || 0) > 0) return id
    } else {
        for (let id of smeltables) if ((inv[id] || 0) > 0) return id
        for (let id of smokerInputs) if ((inv[id] || 0) > 0) return id
    }
    return null
}
function isWorkItem(id) {
    return !!(polishMap[id] || mineralBlocks[id] ||
        isSmeltable(id) || fuels.indexOf(id) !== -1 ||
        cursedInfuserInputs.indexOf(id) !== -1 || isEnchantable(id) ||
        id === 'minecraft:paper' || id === 'minecraft:sand' ||
        id === 'create:sand_paper' || id === 'minecraft:lapis_lazuli' ||
        id === 'goety:snap_warts' || id === 'goety:snap_fungus' ||
        roughGemShards.indexOf(id) !== -1 ||
        planterSeedReserve[id] !== undefined || toolItems.indexOf(id) !== -1)
}
function getMemory(entity) {
    let s = entity.persistentData.getString('memory')
    return s ? JSON.parse(s) : []
}
function setMemory(entity, mem) {
    entity.persistentData.putString('memory', JSON.stringify(mem))
}

// 读取基座展示物品
function getPedestalItem(level, pos) {
    if (!pos.pedestal) return null
    let be = getContainerAt(level, pos.pedestal)
    if (!be) return null
    let stack = be.getItem(0)
    return stack && !stack.isEmpty() ? stack.id : null
}

function useRaiderChest(level, inv, pos, entity) {
    let containers = getStorageContainers(level, pos)
    if (!containers.length) return
    let did = []
    try { entity.triggerAnim('interact', 'interact') } catch (e) {}
    for (let id in inv) {
        if (isWorkItem(id)) continue
        let left = depositToStorage(level, pos, id, inv[id])
        let put = inv[id] - left
        if (put > 0) did.push('存 ' + put + 'x' + id)
        if (left <= 0) delete inv[id]
        else {
            inv[id] = left
            break
        }
    }
    for (let be of containers) {
        for (let i = 0; i < be.getContainerSize(); i++) {
            let stack = be.getItem(i)
            if (!stack.isEmpty() && isWorkItem(stack.id) && !stack.isEnchanted()) {
                let take = stack.count
                if (itemReserve[stack.id] !== undefined) {
                    let need = itemReserve[stack.id] - (inv[stack.id] || 0)
                    if (need <= 0) continue
                    take = Math.min(stack.count, need)
                }
                addInv(inv, stack.id, take)
                if (take < stack.count) be.setItem(i, Item.of(stack.id, stack.count - take))
                else be.setItem(i, $ItemStack.EMPTY)
                did.push('取 ' + take + 'x' + stack.id)
            }
        }
    }
    if (did.length) debugItem(entity, '箱子 ' + did.join(', '))
}

function useComposter(level, inv, pos, entity) {
    let bc = level.getBlock(pos.composter[0], pos.composter[1], pos.composter[2])
    if (!bc || bc.id !== 'minecraft:composter') return
    let cpos = new BlockPos(pos.composter[0], pos.composter[1], pos.composter[2])
    let props = bc.getProperties()
    let lvl = parseInt(props.get('level') || '0')
    if (lvl >= 8) {
        try {
            $ComposterBlock.extractProduce(entity, bc.getBlockState(), level, cpos)
        } catch (e) {}
        let did = []
        collectNearbyItems(level, inv, pos.composter, did)
        if (did.length) debugItem(entity, '堆肥桶 ' + did.join(', '))
        return
    }
    if (lvl >= 7) return
    let chestInv = getChestInvMap(level, pos)
    for (let seedId of seedItems) {
        let total = (inv[seedId] || 0) + (chestInv[seedId] || 0)
        if (total <= 64) continue
        let removed = removeFromStorage(level, pos, seedId, 1)
        if (!removed && !removeInv(inv, seedId, 1)) continue
        try {
            $ComposterBlock.insertItem(entity, bc.getBlockState(), level, Item.of(seedId, 1), cpos)
        } catch (e) {}
        debugItem(entity, '堆肥 1x ' + seedId)
        return
    }
}

function depositNonWorkItems(entity, inv, pos) {
    let did = []
    for (let id in inv) {
        if (isWorkItem(id)) continue
        let left = depositToStorage(entity.level, pos, id, inv[id])
        let put = inv[id] - left
        if (put > 0) did.push(put + 'x ' + id)
        if (left <= 0) delete inv[id]
        else { inv[id] = left; break }
    }
    if (did.length) debugItem(entity, '存 ' + did.join(', '))
}

function depositSurplus(entity, inv, pos) {
    let did = []
    for (let item in itemReserve) {
        let keep = itemReserve[item]
        let have = inv[item] || 0
        if (have <= keep) continue
        let excess = have - keep
        let left = depositToStorage(entity.level, pos, item, excess)
        let put = excess - left
        inv[item] = keep + left
        if (put > 0) did.push(put + 'x ' + item)
    }
    if (did.length) debugItem(entity, '存多余 ' + did.join(', '))
}

function useHopper(level, inv, pos, entity) {
    let be = getContainerAt(level, pos)
    if (!be) return
    let did = []
    for (let i = 0; i < be.getContainerSize(); i++) {
        let stack = be.getItem(i)
        if (!stack.isEmpty() && !stack.isEnchanted()) {
            addInv(inv, stack.id, stack.count)
            be.setItem(i, $ItemStack.EMPTY)
            did.push('取 ' + stack.count + 'x' + stack.id)
        }
    }
    if (did.length) debugItem(entity, '漏斗 ' + did.join(', '))
}

function getFurnaces(pos) {
    if (pos.furnaces && pos.furnaces.length) return pos.furnaces
    if (pos.furnace) return [pos.furnace]
    return []
}
function hasPosition(pos, key) {
    if (key === 'furnaces') return getFurnaces(pos).length > 0
    if (key === 'barrels') return !!(pos.barrels && pos.barrels.length)
    return !!pos[key]
}
function furnaceNeedsWork(level, inv, p) {
    let be = getContainerAt(level, p)
    if (!be) return false
    if (be.getItem(2).count >= FURNACE_OUTPUT_THRESHOLD) return true
    if (be.getItem(1).isEmpty() && findInv(inv, fuels)) return true
    let type = furnaceTypeOf(level, p)
    let input = be.getItem(0)
    if (input.isEmpty()) return !!findFurnaceInput(inv, type)
    return input.count < 64 && !!inv[input.id]
}
function firstFurnaceNeedingWork(level, inv, pos) {
    for (let p of getFurnaces(pos)) {
        if (furnaceNeedsWork(level, inv, p)) return p
    }
    return null
}
function furnaceInRange(level, entity, p) {
    let dx = entity.x - (p[0] + 0.5)
    let dy = entity.y - p[1]
    let dz = entity.z - (p[2] + 0.5)
    return dx * dx + dy * dy + dz * dz <= WORK_DIST_SQ
}
function distributeFuel(level, inv, furnaces, did) {
    let needFuel = []
    for (let p of furnaces) {
        let be = getContainerAt(level, p)
        if (be && be.getItem(1).isEmpty()) needFuel.push(be)
    }
    if (needFuel.length === 0) return
    let fuelCount = 0
    for (let fid of fuels) fuelCount += (inv[fid] || 0)
    if (fuelCount <= 0) return
    let share = Math.min(Math.max(1, Math.floor(fuelCount / needFuel.length)), 64)
    for (let be of needFuel) {
        let remaining = share
        for (let fid of fuels) {
            if (remaining <= 0) break
            let have = inv[fid] || 0
            let take = Math.min(have, remaining)
            if (take > 0) {
                removeInv(inv, fid, take)
                be.setItem(1, Item.of(fid, take))
                remaining -= take
            }
        }
        if (remaining < share) did.push('加燃料 ' + (share - remaining))
    }
}
function useFurnaces(level, inv, pos, entity) {
    let furnaces = getFurnaces(pos).filter(p => furnaceInRange(level, entity, p))
    if (furnaces.length === 0) return
    let did = []
    for (let p of furnaces) {
        let be = getContainerAt(level, p)
        if (!be) continue
        let output = be.getItem(2)
        if (!output.isEmpty()) {
            addInv(inv, output.id, output.count)
            be.setItem(2, $ItemStack.EMPTY)
            did.push('取 ' + output.count + 'x' + output.id)
        }
    }
    distributeFuel(level, inv, furnaces, did)
    for (let p of furnaces) {
        let be = getContainerAt(level, p)
        if (!be) continue
        let type = furnaceTypeOf(level, p)
        let input = be.getItem(0)
        if (input.isEmpty()) {
            let mid = findFurnaceInput(inv, type)
            if (mid) {
                let count = Math.min(inv[mid], 64)
                removeInv(inv, mid, count)
                be.setItem(0, Item.of(mid, count))
                did.push('放 ' + count + 'x' + mid + ' 到 ' + type)
            }
        } else if (inv[input.id]) {
            let add = Math.min(inv[input.id], 64 - input.count)
            if (add > 0) {
                removeInv(inv, input.id, add)
                be.setItem(0, Item.of(input.id, input.count + add))
                did.push('补 ' + add + 'x' + input.id)
            }
        }
    }
    if (did.length) debugItem(entity, '熔炉 ' + did.join(', '))
}

function useWorkstation(inv, entity) {
    let did = []
    for (let ingot in mineralBlocks) {
        let have = inv[ingot] || 0
        if (have < 32) continue
        let count = Math.floor(have / 9)
        if (count > 0) {
            removeInv(inv, ingot, count * 9)
            addInv(inv, mineralBlocks[ingot], count)
            did.push(count + 'x' + mineralBlocks[ingot])
        }
    }
    let paper = inv['minecraft:paper'] || 0
    let sand = inv['minecraft:sand'] || 0
    let count = Math.min(paper, sand)
    if (count > 0) {
        removeInv(inv, 'minecraft:paper', count)
        removeInv(inv, 'minecraft:sand', count)
        addInv(inv, 'create:sand_paper', count)
        did.push(count + 'x create:sand_paper')
    }
    let fungus = inv['goety:snap_fungus'] || 0
    if (fungus > 0) {
        removeInv(inv, 'goety:snap_fungus', fungus)
        addInv(inv, 'goety:snap_warts', fungus * 4)
        did.push(fungus + 'x goety:snap_fungus -> ' + (fungus * 4) + 'x goety:snap_warts')
    }
    let shards = inv['spelunkery:rough_diamond_shard'] || 0
    let roughCount = Math.floor(shards / 9)
    if (roughCount > 0) {
        removeInv(inv, 'spelunkery:rough_diamond_shard', roughCount * 9)
        addInv(inv, 'spelunkery:rough_diamond', roughCount)
        did.push(roughCount + 'x spelunkery:rough_diamond')
    }
    if (did.length) debugItem(entity, '合成 ' + did.join(', '))
}

function polishGems(inv, entity) {
    let sandpaper = inv['create:sand_paper'] || 0
    if (sandpaper < 1) return
    let did = []
    for (let rough in polishMap) {
        let maxBySand = sandpaper * 8
        let count = Math.min(inv[rough] || 0, maxBySand)
        if (count < 1) continue
        removeInv(inv, rough, count)
        let usedSand = Math.ceil(count / 8)
        removeInv(inv, 'create:sand_paper', usedSand)
        addInv(inv, polishMap[rough], count)
        did.push(count + 'x' + rough + ' -> ' + polishMap[rough])
        sandpaper -= usedSand
    }
    if (did.length) debugItem(entity, '打磨 ' + did.join(', '))
}

function isEnchantable(id) {
    return id.indexOf('sword') !== -1 || id.indexOf('pickaxe') !== -1 || id.indexOf('axe') !== -1 ||
        id.indexOf('shovel') !== -1 || id.indexOf('hoe') !== -1 || id.indexOf('helmet') !== -1 ||
        id.indexOf('chestplate') !== -1 || id.indexOf('leggings') !== -1 || id.indexOf('boots') !== -1 ||
        id.indexOf('book') !== -1 || id.indexOf('bow') !== -1
}

function enchant(level, inv, entity, pos) {
    if ((inv['minecraft:lapis_lazuli'] || 0) < 3) return
    for (let id in inv) {
        let stack = Item.of(id)
        if (stack.isEmpty()) continue
        if (!isEnchantTarget(id)) continue
        removeInv(inv, id, 1)
        removeInv(inv, 'minecraft:lapis_lazuli', 3)
        let enchanted = $EnchantmentHelper.enchantItem(level.random, stack, 30, false)
        for (let be of getStorageContainers(level, pos)) {
            let slot = findEmptySlot(be)
            if (slot !== -1) {
                be.setItem(slot, enchanted)
                debugItem(entity, '附魔 ' + enchanted.id + ' 已存入箱子')
                return
            }
        }
        addInv(inv, enchanted.id, 1)
        debugItem(entity, '附魔 ' + enchanted.id + '（无箱子或箱子满，暂存背包）')
        return
    }
}

const pickaxeTiers = {
    'minecraft:iron_pickaxe': 2,
    'minecraft:diamond_pickaxe': 3,
    'kubejs:pale_metal_pickaxe': 4
}
function isEnchantTarget(id) {
    return isEnchantable(id) && pickaxeTiers[id] === undefined
}
const pickaxeCraftOrder = [
    { id: 'kubejs:pale_metal_pickaxe', recipe: 'pale_steel_pickaxe' },
    { id: 'minecraft:diamond_pickaxe', recipe: 'diamond_pickaxe' },
    { id: 'minecraft:iron_pickaxe', recipe: 'iron_pickaxe' }
]
function readEnchants(stack) {
    let map = {}
    try {
        if (stack.nbt && stack.nbt.Enchantments) {
            for (let e of stack.nbt.Enchantments) {
                map[String(e.id)] = parseInt(e.lvl || '1')
            }
        }
    } catch (err) {}
    return map
}
function pickaxeScore(id, enchants) {
    let score = pickaxeTiers[id] || 0
    for (let e in enchants) {
        let lvl = enchants[e] || 1
        if (e === 'minecraft:fortune') score += lvl * 1.5
        else if (e === 'minecraft:efficiency') score += lvl * 0.4
        else if (e === 'minecraft:unbreaking') score += lvl * 0.2
        else if (e === 'minecraft:silk_touch') score -= 10
    }
    return score
}
const pickaxeBaseEnchants = {
    'kubejs:pale_metal_pickaxe': { 'minecraft:fortune': 4, 'minecraft:efficiency': 3, 'minecraft:unbreaking': 4 }
}
function pickaxeIdScore(id) {
    return pickaxeScore(id, pickaxeBaseEnchants[id] || {})
}
function pickaxeStackFor(id) {
    let stack = Item.of(id)
    let ench = pickaxeBaseEnchants[id] || {}
    for (let e in ench) stack = stack.enchant(e, ench[e])
    return stack
}
function bestPickaxeStack(level, pos, inv) {
    let best = null, bestScore = -1e9
    for (let id of Object.keys(pickaxeTiers)) {
        if ((inv[id] || 0) > 0) {
            let s = pickaxeIdScore(id)
            if (s > bestScore) { bestScore = s; best = pickaxeStackFor(id) }
        }
    }
    for (let be of getStorageContainers(level, pos)) {
        for (let i = 0; i < be.getContainerSize(); i++) {
            let st = be.getItem(i)
            if (st.isEmpty()) continue
            if (pickaxeTiers[st.id] !== undefined) {
                let s = pickaxeScore(st.id, readEnchants(st))
                if (s > bestScore) { bestScore = s; best = st }
            }
        }
    }
    return best
}
function planPickaxe(entity, level, pos, inv, chestInv) {
    let currentBest = bestPickaxeStack(level, pos, inv)
    let currentScore = currentBest ? pickaxeScore(currentBest.id, readEnchants(currentBest)) : -1
    for (let p of pickaxeCraftOrder) {
        if (pickaxeIdScore(p.id) <= currentScore) continue
        let r = recipeById(p.recipe)
        if (!r) continue
        let enough = true
        for (let k in r.in) {
            if (k === 'minecraft:stick') continue
            if (availableCount(inv, chestInv, k) < r.in[k]) { enough = false; break }
        }
        if (!enough) {
            let missing = findMissingMaterials(inv, chestInv, p.id, 1, 0, [], [], true)
            if (missing.length) requestMaterials(entity, p.id, missing)
            return null
        }
        let plan = []
        for (let k in r.in) {
            let sub = planGetItem(inv, chestInv, k, r.in[k], 0, [])
            if (!sub) { enough = false; break }
            plan = plan.concat(sub)
        }
        if (!enough) continue
        plan.push({ a: 'craft_pickaxe', recipe: p.recipe, id: p.id })
        return plan
    }
    return null
}

function getCropAge(bc) {
    let props = bc.getProperties()
    if (!props) return -1
    let age = props.get('age')
    if (age === null || age === undefined) return -1
    return parseInt(age)
}
function findFarmTarget(level, entity, inv) {
    let bx = Math.floor(entity.x), by = Math.floor(entity.y), bz = Math.floor(entity.z)
    for (let dy = -FARM_RANGE; dy <= FARM_RANGE; dy++)
        for (let dz = -FARM_RANGE; dz <= FARM_RANGE; dz++)
            for (let dx = -FARM_RANGE; dx <= FARM_RANGE; dx++) {
                let x = bx + dx, y = by + dy, z = bz + dz
                let bc = level.getBlock(x, y, z)
                if (!bc) continue
                let crop = farmCrops[bc.id]
                if (!crop) continue
                if (crop.seed !== crop.harvest && (inv[crop.seed] || 0) < 1) continue
                if (getCropAge(bc) >= crop.maxAge) {
                    return { type: 'crop', id: bc.id, x: x, y: y, z: z, bc: bc }
                }
            }
    return null
}
function findAmethystTarget(level, entity) {
    let bx = Math.floor(entity.x), by = Math.floor(entity.y), bz = Math.floor(entity.z)
    for (let dy = -FARM_RANGE; dy <= FARM_RANGE; dy++)
        for (let dz = -FARM_RANGE; dz <= FARM_RANGE; dz++)
            for (let dx = -FARM_RANGE; dx <= FARM_RANGE; dx++) {
                let x = bx + dx, y = by + dy, z = bz + dz
                let bc = level.getBlock(x, y, z)
                if (bc && bc.id === 'minecraft:amethyst_cluster') {
                    return { type: 'amethyst', x: x, y: y, z: z, bc: bc }
                }
            }
    return null
}
function handleAmethyst(entity, inv, pos) {
    let level = entity.level
    let target = findAmethystTarget(level, entity)
    if (!target) return false
    let dx = entity.x - (target.x + 0.5)
    let dy = entity.y - target.y
    let dz = entity.z - (target.z + 0.5)
    if (dx * dx + dy * dy + dz * dz > WORK_DIST_SQ) {
        entity.navigation.moveTo(target.x + 0.5, target.y, target.z + 0.5, 1.0)
        setTask(entity, '前往采集紫水晶')
        return true
    }
    harvestAmethyst(level, inv, target, entity, pos)
    setTask(entity, '采集紫水晶')
    return true
}
function storeHarvest(level, pos, inv, id, count) {
    let left = depositToStorage(level, pos, id, count)
    if (left <= 0) return
    addInv(inv, id, left)
}
function harvestCrop(level, inv, target, entity, pos) {
    let bc = target.bc
    let crop = farmCrops[target.id]
    let drops = bc.getDrops() || []
    let harvestCount = 0
    for (let stack of drops) {
        if (stack.id === crop.harvest) harvestCount += stack.count
    }
    let props = bc.getProperties()
    let newProps = { age: '0' }
    let facing = props.get('facing')
    if (facing !== null && facing !== undefined) newProps.facing = facing
    bc.set(target.id, newProps, 3)
    if (crop.seed === crop.harvest) {
        harvestCount = Math.max(0, harvestCount - 1)
    } else {
        removeInv(inv, crop.seed, 1)
    }
    if (harvestCount > 0) {
        if (crop.keepHarvest) addInv(inv, crop.harvest, harvestCount)
        else storeHarvest(level, pos, inv, crop.harvest, harvestCount)
    }
    debugItem(entity, '收割 ' + target.id + ' 得 ' + harvestCount + 'x ' + crop.harvest)
}
function harvestAmethyst(level, inv, target, entity, pos) {
    let pickaxe = bestPickaxeStack(level, pos, inv)
    let drops = pickaxe ? (target.bc.getDrops(entity, pickaxe) || []) : (target.bc.getDrops() || [])
    level.destroyBlock(new BlockPos(target.x, target.y, target.z), false, null, 512)
    for (let stack of drops) {
        if (stack.count > 0) storeHarvest(level, pos, inv, stack.id, stack.count)
    }
    debugItem(entity, '采集紫水晶簇')
}
function handleFarming(entity, inv, pos) {
    let level = entity.level
    let target = findFarmTarget(level, entity, inv)
    if (!target) return false
    let dx = entity.x - (target.x + 0.5)
    let dy = entity.y - target.y
    let dz = entity.z - (target.z + 0.5)
    if (dx * dx + dy * dy + dz * dz > WORK_DIST_SQ) {
        entity.navigation.moveTo(target.x + 0.5, target.y, target.z + 0.5, 1.0)
        setTask(entity, '前往收割作物')
        return true
    }
    harvestCrop(level, inv, target, entity, pos)
    setTask(entity, '收割作物')
    return true
}
function findPlanterTarget(level, entity) {
    let bx = Math.floor(entity.x), by = Math.floor(entity.y), bz = Math.floor(entity.z)
    for (let dy = -FARM_RANGE; dy <= FARM_RANGE; dy++)
        for (let dz = -FARM_RANGE; dz <= FARM_RANGE; dz++)
            for (let dx = -FARM_RANGE; dx <= FARM_RANGE; dx++) {
                let x = bx + dx, y = by + dy, z = bz + dz
                let planterBc = level.getBlock(x, y, z)
                if (!planterBc) continue
                if (planterBlocks.indexOf(planterBc.id) === -1) continue
                let cropBc = level.getBlock(x, y + 1, z)
                if (!cropBc) continue
                let crop = planterCrops[cropBc.id]
                if (!crop) continue
                if (getCropAge(cropBc) >= crop.maxAge) {
                    return { type: 'planter', cropId: cropBc.id, x: x, y: y + 1, z: z, bc: cropBc }
                }
            }
    return null
}
function harvestPlanterCrop(level, inv, target, entity, pos) {
    let bc = target.bc
    let crop = planterCrops[target.cropId]
    let drops = bc.getDrops() || []
    let props = bc.getProperties()
    let newProps = { age: '0' }
    let ropelogged = props.get('ropelogged')
    if (ropelogged !== null && ropelogged !== undefined) newProps.ropelogged = ropelogged
    let supporting = props.get('supporting')
    if (supporting !== null && supporting !== undefined) newProps.supporting = supporting
    bc.set(target.cropId, newProps, 3)
    let usedSeed = false
    for (let stack of drops) {
        if (stack.count <= 0) continue
        let put = stack.count
        if (!usedSeed && stack.id === crop.seed) {
            put -= 1
            usedSeed = true
        }
        if (put > 0) storeHarvest(level, pos, inv, stack.id, put)
    }
    if (!usedSeed) removeInv(inv, crop.seed, 1)
    debugItem(entity, '收割 ' + target.cropId)
}
function handlePlanterFarming(entity, inv, pos) {
    let level = entity.level
    let target = findPlanterTarget(level, entity)
    if (!target) return false
    let dx = entity.x - (target.x + 0.5)
    let dy = entity.y - target.y
    let dz = entity.z - (target.z + 0.5)
    if (dx * dx + dy * dy + dz * dz > WORK_DIST_SQ) {
        entity.navigation.moveTo(target.x + 0.5, target.y, target.z + 0.5, 1.0)
        setTask(entity, '前往种植盆')
        return true
    }
    harvestPlanterCrop(level, inv, target, entity, pos)
    setTask(entity, '收割种植盆')
    return true
}
function findSugarcaneTarget(level, entity) {
    let bx = Math.floor(entity.x), by = Math.floor(entity.y), bz = Math.floor(entity.z)
    for (let dy = -FARM_RANGE; dy <= FARM_RANGE; dy++)
        for (let dz = -FARM_RANGE; dz <= FARM_RANGE; dz++)
            for (let dx = -FARM_RANGE; dx <= FARM_RANGE; dx++) {
                let x = bx + dx, y = by + dy, z = bz + dz
                let bc = level.getBlock(x, y, z)
                if (!bc || bc.id !== 'minecraft:sugar_cane') continue
                let below = level.getBlock(x, y - 1, z)
                if (below && below.id === 'minecraft:sugar_cane') continue
                let height = 0
                for (let h = 0; h < 4; h++) {
                    let b = level.getBlock(x, y + h, z)
                    if (b && b.id === 'minecraft:sugar_cane') height++
                    else break
                }
                if (height >= 3) return { x: x, y: y, z: z, height: height }
            }
    return null
}
function harvestSugarcane(level, inv, target, entity, pos) {
    let total = 0
    for (let h = 1; h < target.height; h++) {
        let bc = level.getBlock(target.x, target.y + h, target.z)
        if (!bc || bc.id !== 'minecraft:sugar_cane') continue
        let drops = bc.getDrops() || []
        bc.set('minecraft:air')
        for (let stack of drops) {
            if (stack.id === 'minecraft:sugar_cane') total += stack.count
        }
    }
    if (total > 0 && Math.random() < 0.2) {
        total *= 2
        debugItem(entity, '幸运双倍收获')
    }
    if (total > 0) storeHarvest(level, pos, inv, 'minecraft:sugar_cane', total)
    debugItem(entity, '收割甘蔗 得 ' + total + 'x 甘蔗')
}
function handleSugarcane(entity, inv, pos) {
    let level = entity.level
    let target = findSugarcaneTarget(level, entity)
    if (!target) return false
    let dx = entity.x - (target.x + 0.5)
    let dy = entity.y - (target.y + 1)
    let dz = entity.z - (target.z + 0.5)
    if (dx * dx + dy * dy + dz * dz > WORK_DIST_SQ) {
        entity.navigation.moveTo(target.x + 0.5, target.y + 1, target.z + 0.5, 1.0)
        setTask(entity, '前往收割甘蔗')
        return true
    }
    harvestSugarcane(level, inv, target, entity, pos)
    setTask(entity, '收割甘蔗')
    return true
}
function findSilkTouchAxe(level, pos) {
    for (let be of getStorageContainers(level, pos)) {
        for (let i = 0; i < be.getContainerSize(); i++) {
            let s = be.getItem(i)
            if (s.isEmpty()) continue
            if (s.id.indexOf('axe') !== -1) {
                let ench = readEnchants(s)
                if (ench['minecraft:silk_touch']) return s
            }
        }
    }
    return null
}
function findGourdTarget(level, entity) {
    let bx = Math.floor(entity.x), by = Math.floor(entity.y), bz = Math.floor(entity.z)
    for (let dy = -FARM_RANGE; dy <= FARM_RANGE; dy++)
        for (let dz = -FARM_RANGE; dz <= FARM_RANGE; dz++)
            for (let dx = -FARM_RANGE; dx <= FARM_RANGE; dx++) {
                let x = bx + dx, y = by + dy, z = bz + dz
                let bc = level.getBlock(x, y, z)
                if (!bc) continue
                if (bc.id === 'minecraft:melon' || bc.id === 'minecraft:pumpkin') {
                    return { x: x, y: y, z: z, bc: bc }
                }
            }
    return null
}
function harvestGourd(level, inv, target, entity, pos) {
    let axe = findSilkTouchAxe(level, pos)
    let drops = axe ? (target.bc.getDrops(entity, axe) || []) : (target.bc.getDrops() || [])
    level.destroyBlock(new BlockPos(target.x, target.y, target.z), false, null, 512)
    for (let stack of drops) {
        if (stack.count > 0) storeHarvest(level, pos, inv, stack.id, stack.count)
    }
    debugItem(entity, '采摘 ' + target.bc.id + (axe ? '（精准采集）' : ''))
}
function handleGourd(entity, inv, pos) {
    let level = entity.level
    let target = findGourdTarget(level, entity)
    if (!target) return false
    let dx = entity.x - (target.x + 0.5)
    let dy = entity.y - target.y
    let dz = entity.z - (target.z + 0.5)
    if (dx * dx + dy * dy + dz * dz > WORK_DIST_SQ) {
        entity.navigation.moveTo(target.x + 0.5, target.y, target.z + 0.5, 1.0)
        setTask(entity, '前往采摘瓜果')
        return true
    }
    harvestGourd(level, inv, target, entity, pos)
    setTask(entity, '采摘瓜果')
    return true
}

function recipeById(id) {
    for (let r of recipes) if (r.id === id) return r
    return null
}
function recipesByOutput(item) {
    let result = []
    for (let r of recipes) if (r.out[item]) result.push(r)
    return result
}
function roughForPolished(polished) {
    for (let rough in polishMap) if (polishMap[rough] === polished) return rough
    return null
}
function cloneInv(obj) {
    let r = {}
    for (let k in obj) r[k] = obj[k]
    return r
}
function availableCount(inv, chestInv, item) {
    return (inv[item] || 0) + (chestInv[item] || 0)
}
function applyStep(inv, chestInv, step) {
    if (step.a === 'take') {
        inv[step.item] = (inv[step.item] || 0) + step.count
        chestInv[step.item] = (chestInv[step.item] || 0) - step.count
    } else if (step.a === 'craft') {
        let r = recipeById(step.recipe)
        if (r) {
            let times = step.count || 1
            for (let k in r.in) inv[k] = (inv[k] || 0) - r.in[k] * times
            for (let k in r.out) inv[k] = (inv[k] || 0) + r.out[k] * times
        }
    } else if (step.a === 'polish') {
        let polished = polishMap[step.rough]
        inv[step.rough] = (inv[step.rough] || 0) - step.count
        inv['create:sand_paper'] = (inv['create:sand_paper'] || 0) - Math.ceil(step.count / 8)
        inv[polished] = (inv[polished] || 0) + step.count
    }
}
function applyPlan(inv, chestInv, plan) {
    for (let step of plan) applyStep(inv, chestInv, step)
}
function planGetItem(inv, chestInv, item, count, depth, visited, produce) {
    if (depth > 8) return null
    if (!produce && (inv[item] || 0) >= count) return []
    if (visited.indexOf(item) !== -1) return null
    if (!produce) {
        let chestHas = chestInv[item] || 0
        if (chestHas > 0) {
            let take = Math.min(chestHas, count - (inv[item] || 0))
            let step = { a: 'take', item: item, count: take }
            let ni = cloneInv(inv), nc = cloneInv(chestInv)
            applyStep(ni, nc, step)
            let rest = planGetItem(ni, nc, item, count, depth + 1, visited.concat(item))
            if (rest) return [step].concat(rest)
        }
    }
    for (let r of recipesByOutput(item)) {
        let times = Math.ceil(count / (r.out[item] || 1))
        let ni = cloneInv(inv), nc = cloneInv(chestInv)
        let nv = visited.concat(item)
        let subPlans = []
        let ok = true
        if (r.tool) {
            let toolPlan = planGetItem(ni, nc, r.tool, 1, depth + 1, nv)
            if (!toolPlan) continue
            applyPlan(ni, nc, toolPlan)
            subPlans.push(toolPlan)
        }
        for (let inItem in r.in) {
            let sub = planGetItem(ni, nc, inItem, r.in[inItem] * times, depth + 1, nv)
            if (!sub) { ok = false; break }
            applyPlan(ni, nc, sub)
            subPlans.push(sub)
        }
        if (!ok) continue
        let plan = []
        for (let s of subPlans) plan = plan.concat(s)
        if (r.at === 'cursedInfuser' || r.at === 'water') {
            for (let i = 0; i < times; i++) plan.push({ a: 'craft', recipe: r.id })
        } else {
            plan.push({ a: 'craft', recipe: r.id, count: times })
        }
        return plan
    }
    let rough = roughForPolished(item)
    if (rough) {
        let needSand = Math.ceil(count / 8)
        let ni = cloneInv(inv), nc = cloneInv(chestInv)
        let nv = visited.concat(item)
        let roughPlan = planGetItem(ni, nc, rough, count, depth + 1, nv)
        if (roughPlan) {
            applyPlan(ni, nc, roughPlan)
            let sandPlan = planGetItem(ni, nc, 'create:sand_paper', needSand, depth + 1, nv)
            if (sandPlan) {
                let plan = roughPlan.concat(sandPlan)
                plan.push({ a: 'polish', rough: rough, count: count })
                return plan
            }
        }
    }
    return null
}
function findMissingMaterials(inv, chestInv, item, count, depth, visited, out, produce) {
    out = out || []
    if (depth > 8) return out
    if (visited.indexOf(item) !== -1) return out
    if (!produce && (inv[item] || 0) + (chestInv[item] || 0) >= count) return out
    let rs = recipesByOutput(item)
    if (rs.length) {
        let r = rs[0]
        let times = Math.ceil(count / (r.out[item] || 1))
        if (r.tool) findMissingMaterials(inv, chestInv, r.tool, 1, depth + 1, visited.concat(item), out)
        for (let inItem in r.in) {
            findMissingMaterials(inv, chestInv, inItem, r.in[inItem] * times, depth + 1, visited.concat(item), out)
        }
        return out
    }
    let rough = roughForPolished(item)
    if (rough) {
        findMissingMaterials(inv, chestInv, rough, count, depth + 1, visited.concat(item), out)
        return out
    }
    if (out.indexOf(item) === -1) out.push(item)
    return out
}
function findEnchantableItem(inv, chestInv) {
    for (let id in inv) if (inv[id] > 0 && isEnchantTarget(id)) return id
    for (let id in chestInv) if (chestInv[id] > 0 && isEnchantTarget(id)) return id
    return null
}
function planEnchant(inv, chestInv) {
    let item = findEnchantableItem(inv, chestInv)
    if (!item) return null
    let ni = cloneInv(inv), nc = cloneInv(chestInv)
    let plan = []
    if (!(ni[item] || 0)) {
        let step = { a: 'take', item: item, count: 1 }
        applyStep(ni, nc, step)
        plan.push(step)
    }
    let lapisPlan = planGetItem(ni, nc, 'minecraft:lapis_lazuli', 3, 0, [])
    if (!lapisPlan) return null
    plan = plan.concat(lapisPlan)
    plan.push({ a: 'enchant' })
    return plan
}
function planNetherite(inv, chestInv) {
    let ni = cloneInv(inv), nc = cloneInv(chestInv)
    let scrap = availableCount(ni, nc, 'minecraft:netherite_scrap')
    let goldIngot = availableCount(ni, nc, 'minecraft:gold_ingot')
    let goldBlock = availableCount(ni, nc, 'minecraft:gold_block')
    let totalGold = goldIngot + goldBlock * 9
    let maxCount = Math.min(Math.floor(scrap / 4), Math.floor(totalGold / 4))
    if (maxCount < 1) return null
    let plan = []
    let scrapPlan = planGetItem(ni, nc, 'minecraft:netherite_scrap', maxCount * 4, 0, [])
    if (!scrapPlan) return null
    applyPlan(ni, nc, scrapPlan)
    plan = plan.concat(scrapPlan)
    let goldPlan = planGetItem(ni, nc, 'minecraft:gold_ingot', maxCount * 4, 0, [])
    if (!goldPlan) return null
    plan = plan.concat(goldPlan)
    plan.push({ a: 'craft', recipe: 'netherite', count: maxCount })
    return plan
}
function getPlan(entity) {
    let s = entity.persistentData.getString('plan')
    return s ? JSON.parse(s) : []
}
function setPlan(entity, plan) {
    entity.persistentData.putString('plan', JSON.stringify(plan || []))
}
function describeStep(step) {
    if (step.a === 'take') return '取 ' + step.item + 'x' + step.count
    if (step.a === 'craft') {
        let r = recipeById(step.recipe)
        let n = r ? r.name : step.recipe
        return (step.count && step.count > 1) ? n + ' x' + step.count : n
    }
    if (step.a === 'craft_pickaxe') return '制作镐 ' + step.id
    if (step.a === 'polish') return '打磨 ' + step.rough
    if (step.a === 'enchant') return '附魔'
    if (step.a === 'deposit') return '存 ' + step.item
    return step.a
}
function executeStep(entity, inv, pos, step) {
    let level = entity.level
    if (step.a === 'take') {
        let need = step.count
        for (let chest of getStorageContainers(level, pos)) {
            for (let i = 0; i < chest.getContainerSize() && need > 0; i++) {
                let s = chest.getItem(i)
                if (!s.isEmpty() && !s.isEnchanted() && s.id === step.item) {
                    let take = Math.min(s.count, need)
                    addInv(inv, step.item, take)
                    if (s.count === take) chest.setItem(i, $ItemStack.EMPTY)
                    else chest.setItem(i, Item.of(step.item, s.count - take))
                    need -= take
                }
            }
            if (need <= 0) break
        }
        if (need < step.count) debugItem(entity, '取 ' + (step.count - need) + 'x ' + step.item)
    } else if (step.a === 'craft') {
        let r = recipeById(step.recipe)
        if (!r) return
        let times = step.count || 1
        let enough = true
        for (let k in r.in) if ((inv[k] || 0) < r.in[k] * times) { enough = false; break }
        if (r.tool && (inv[r.tool] || 0) < 1) enough = false
        if (enough) {
            for (let k in r.in) removeInv(inv, k, r.in[k] * times)
            setHeldItem(entity, r.tool || Object.keys(r.in)[0] || Object.keys(r.out)[0])
            if (r.make) {
                let outKey = Object.keys(r.out)[0]
                for (let i = 0; i < times; i++) {
                    let stack = r.make()
                    let placed = false
                    for (let be of getStorageContainers(level, pos)) {
                        let slot = findEmptySlot(be)
                        if (slot !== -1) {
                            be.setItem(slot, stack)
                            placed = true
                            break
                        }
                    }
                    if (!placed) addInv(inv, outKey, 1)
                }
                debugItem(entity, r.name + (times > 1 ? ' x' + times : ''))
            } else {
                for (let k in r.out) addInv(inv, k, r.out[k] * times)
                debugItem(entity, r.name + (times > 1 ? ' x' + times : ''))
            }
        }
    } else if (step.a === 'craft_pickaxe') {
        let r = recipeById(step.recipe)
        if (!r) return
        let enough = true
        for (let k in r.in) if ((inv[k] || 0) < r.in[k]) { enough = false; break }
        if (r.tool && (inv[r.tool] || 0) < 1) enough = false
        if (enough) {
            for (let k in r.in) removeInv(inv, k, r.in[k])
            addInv(inv, step.id, 1)
            setHeldItem(entity, step.id)
            debugItem(entity, '制作镐 ' + step.id)
        }
    } else if (step.a === 'polish') {
        polishGems(inv, entity)
        debugItem(entity, '打磨 ' + step.rough)
    } else if (step.a === 'enchant') {
        enchant(level, inv, entity, pos)
    } else if (step.a === 'deposit') {
        let have = inv[step.item] || 0
        if (have > 0) {
            let left = depositToStorage(level, pos, step.item, have)
            let put = have - left
            if (put > 0) {
                removeInv(inv, step.item, put)
                debugItem(entity, '存 ' + put + 'x ' + step.item)
            }
        }
    }
}
function doCursedInfuserStep(entity, inv, pos, recipe) {
    let level = entity.level
    let be = getContainerAt(level, pos.cursedInfuser)
    if (!be) return true
    let did = []
    let collected = collectNearbyItems(level, inv, pos.cursedInfuser, did)
    if (collected > 0) {
        if (did.length) debugItem(entity, '诅咒注入器 ' + did.join(', '))
        return true
    }
    let input = be.getItem(0)
    if (input.isEmpty()) {
        let mid = findInv(inv, Object.keys(recipe.in))
        if (mid) {
            removeInv(inv, mid, 1)
            be.setItem(0, Item.of(mid))
            did.push('放入 ' + mid)
        } else {
            if (did.length) debugItem(entity, '诅咒注入器 ' + did.join(', '))
            return true
        }
    }
    if (did.length) debugItem(entity, '诅咒注入器 ' + did.join(', '))
    return false
}
function findWaterSource(level, entity) {
    let bx = Math.floor(entity.x), by = Math.floor(entity.y), bz = Math.floor(entity.z)
    for (let dy = -FARM_RANGE; dy <= FARM_RANGE; dy++)
        for (let dz = -FARM_RANGE; dz <= FARM_RANGE; dz++)
            for (let dx = -FARM_RANGE; dx <= FARM_RANGE; dx++) {
                let x = bx + dx, y = by + dy, z = bz + dz
                let bc = level.getBlock(x, y, z)
                if (bc && bc.id === 'minecraft:water_cauldron') return [x, y, z]
            }
    for (let dy = -FARM_RANGE; dy <= FARM_RANGE; dy++)
        for (let dz = -FARM_RANGE; dz <= FARM_RANGE; dz++)
            for (let dx = -FARM_RANGE; dx <= FARM_RANGE; dx++) {
                let x = bx + dx, y = by + dy, z = bz + dz
                let bc = level.getBlock(x, y, z)
                if (bc && bc.id === 'minecraft:water') return [x, y, z]
            }
    return null
}
function doFillBucketStep(level, inv, entity, water, recipe) {
    let x = water[0], y = water[1], z = water[2]
    let bc = level.getBlock(x, y, z)
    if (!bc) return
    if (bc.id === 'minecraft:water') {
        bc.set('minecraft:air')
    } else if (bc.id === 'minecraft:water_cauldron') {
        let props = bc.getProperties()
        let lvl = parseInt(props.get('level') || '3')
        if (lvl <= 1) bc.set('minecraft:cauldron')
        else bc.set('minecraft:water_cauldron', { level: String(lvl - 1) })
    }
    for (let k in recipe.in) removeInv(inv, k, recipe.in[k])
    for (let k in recipe.out) addInv(inv, k, recipe.out[k])
    setHeldItem(entity, 'minecraft:bucket')
    debugItem(entity, '装水')
}
function stepPlan(entity, inv, pos) {
    let plan = getPlan(entity)
    if (!plan || plan.length === 0) return false
    let step = plan[0]
    let level = entity.level
    let targetPos = null
    let navTask = ''
    if (step.a === 'take' || step.a === 'deposit') {
        targetPos = firstStoragePos(pos)
        navTask = '前往箱子'
    } else if (step.a === 'craft') {
        let r = recipeById(step.recipe)
        if (r && r.at === 'workstation') {
            targetPos = pos.workstation
            navTask = '前往工作台'
        } else if (r && r.at === 'cursedInfuser') {
            targetPos = pos.cursedInfuser
            navTask = '前往诅咒注入器'
        } else if (r && r.at === 'water') {
            let water = findWaterSource(level, entity)
            if (!water) {
                plan.shift()
                setPlan(entity, plan)
                setTask(entity, '附近没有水源')
                return true
            }
            targetPos = water
            navTask = '前往水源'
        }
    } else if (step.a === 'craft_pickaxe') {
        targetPos = pos.workstation
        navTask = '前往工作台'
    } else if (step.a === 'enchant') {
        targetPos = pos.enchantingTable
        navTask = '前往附魔台'
    }
    if (targetPos) {
        let dx = entity.x - (targetPos[0] + 0.5)
        let dy = entity.y - targetPos[1]
        let dz = entity.z - (targetPos[2] + 0.5)
        if (dx * dx + dy * dy + dz * dz > WORK_DIST_SQ) {
            entity.navigation.moveTo(targetPos[0] + 0.5, targetPos[1], targetPos[2] + 0.5, 1.0)
            setTask(entity, navTask + '（计划）')
            return true
        }
    }
    if (step.a === 'craft') {
        let r = recipeById(step.recipe)
        if (r && r.at === 'cursedInfuser') {
            let done = doCursedInfuserStep(entity, inv, pos, r)
            if (done) plan.shift()
            setPlan(entity, plan)
            setTask(entity, '注入 ' + r.name)
            return true
        }
        if (r && r.at === 'water') {
            let water = findWaterSource(level, entity)
            if (!water) {
                plan.shift()
                setPlan(entity, plan)
                setTask(entity, '附近没有水源')
                return true
            }
            doFillBucketStep(level, inv, entity, water, r)
            plan.shift()
            setPlan(entity, plan)
            setTask(entity, '装水')
            return true
        }
    }
    executeStep(entity, inv, pos, step)
    plan.shift()
    setPlan(entity, plan)
    setTask(entity, '执行 ' + describeStep(step))
    return true
}
function getMaxStack(id) {
    try {
        let s = Item.of(id)
        if (s && !s.isEmpty() && s.getMaxStackSize) return s.getMaxStackSize()
    } catch (e) {}
    return 64
}
function demandThreshold(id) {
    return Math.max(1, Math.floor(getMaxStack(id) / 2))
}
function thinkAndPlan(entity, inv, pos) {
    let level = entity.level
    let chestInv = getChestInvMap(level, pos)
    let pedestalItem = getPedestalItem(level, pos)
    if (pedestalItem && pedestalTargets[pedestalItem]) {
        let lastPedestal = entity.persistentData.getString('lastPedestal')
        if (lastPedestal !== pedestalItem) {
            entity.persistentData.putString('lastPedestal', pedestalItem)
            clearDemand(entity)
        }
        if (availableCount(inv, chestInv, pedestalItem) >= demandThreshold(pedestalItem)) {
        } else {
            let plan = planGetItem(inv, chestInv, pedestalItem, 1, 0, [], true)
            if (plan && plan.length) {
                plan.push({ a: 'deposit', item: pedestalItem, count: 1 })
                setPlan(entity, plan)
                setTask(entity, '思考 ' + plan.map(describeStep).join(' → '))
                return true
            }
            let missing = findMissingMaterials(inv, chestInv, pedestalItem, 1, 0, [], [], true)
            if (missing.length) requestMaterials(entity, pedestalItem, missing)
        }
    }
    if (pos.enchantingTable) {
        let plan = planEnchant(inv, chestInv)
        if (plan && plan.length) {
            setPlan(entity, plan)
            setTask(entity, '思考 ' + plan.map(describeStep).join(' → '))
            return true
        }
    }
    if (pos.workstation) {
        let plan = planPickaxe(entity, level, pos, inv, chestInv)
        if (plan && plan.length) {
            setPlan(entity, plan)
            setTask(entity, '思考 ' + plan.map(describeStep).join(' → '))
            return true
        }
        plan = planNetherite(inv, chestInv)
        if (plan && plan.length) {
            setPlan(entity, plan)
            setTask(entity, '思考 ' + plan.map(describeStep).join(' → '))
            return true
        }
    }
    let needPaper = false
    for (let rough in polishMap) {
        if ((inv[rough] || 0) > 0) { needPaper = true; break }
    }
    if (needPaper && (inv['minecraft:paper'] || 0) === 0 && (chestInv['minecraft:paper'] || 0) === 0) {
        requestMaterials(entity, 'minecraft:paper', ['minecraft:paper'])
    }
    return false
}

const positionPriority = ['hopper', 'chest', 'raiderChest', 'barrels', 'furnaces', 'workstation', 'cursedInfuser', 'composter']
function needsWork(level, inv, pos, key) {
    let p = pos[key]
    if (key === 'furnaces') {
        for (let fp of getFurnaces(pos)) {
            if (furnaceNeedsWork(level, inv, fp)) return true
        }
        return false
    }
    if (!p) return false
    let pedestalItem = getPedestalItem(level, pos)
    if (pedestalItem && pedestalTargets[pedestalItem]) {
        if (key === 'cursedInfuser' || key === 'workstation') return false
    }
    if (key === 'workstation') {
        for (let ingot in mineralBlocks) if ((inv[ingot] || 0) >= 9) return true
        if ((inv['goety:snap_fungus'] || 0) >= 1) return true
        if ((inv['spelunkery:rough_diamond_shard'] || 0) >= 9) return true
        return (inv['minecraft:paper'] || 0) >= 1 && (inv['minecraft:sand'] || 0) >= 1
    }
    if (key === 'enchantingTable') return false
    if (key === 'composter') {
        let cb = level.getBlock(p[0], p[1], p[2])
        if (cb && cb.id === 'minecraft:composter') {
            let cprops = cb.getProperties()
            if (parseInt(cprops.get('level') || '0') >= 8) return true
        }
        let chestInv = getChestInvMap(level, pos)
        for (let seedId of seedItems) {
            if ((inv[seedId] || 0) + (chestInv[seedId] || 0) > 64) return true
        }
        return false
    }
    if (key === 'chest' || key === 'raiderChest' || key === 'barrels') {
        let containers = getStorageContainers(level, pos)
        if (!containers.length) return false
        for (let be of containers) {
            let hasEmptySlot = false
            for (let i = 0; i < be.getContainerSize(); i++) {
                if (be.getItem(i).isEmpty()) { hasEmptySlot = true; break }
            }
            if (hasEmptySlot) {
                for (let id in inv) if (!isWorkItem(id)) return true
                break
            }
        }
        for (let be of containers) {
            for (let i = 0; i < be.getContainerSize(); i++) {
                let s = be.getItem(i)
                if (!s.isEmpty() && isWorkItem(s.id) && !s.isEnchanted()) {
                    if (itemReserve[s.id] !== undefined && (inv[s.id] || 0) >= itemReserve[s.id]) continue
                    return true
                }
            }
        }
        return false
    }
    let be = getContainerAt(level, p)
    if (!be) return false
    switch (key) {
        case 'hopper':
            for (let i = 0; i < be.getContainerSize(); i++) {
                let s = be.getItem(i)
                if (!s.isEmpty() && !s.isEnchanted()) return true
            }
            return false
        case 'cursedInfuser':
            if (be.getItem(0).isEmpty() && findInv(inv, cursedInfuserInputs)) return true
            return hasNearbyItems(level, p)
    }
    return false
}
function doWork(entity, inv, pos, key) {
    let level = entity.level
    switch (key) {
        case 'hopper': useHopper(level, inv, pos[key], entity); break
        case 'raiderChest':
        case 'chest':
        case 'barrels': useRaiderChest(level, inv, pos, entity); break
        case 'furnaces': useFurnaces(level, inv, pos, entity); break
        case 'workstation': useWorkstation(inv, entity); break
        case 'enchantingTable': enchant(level, inv, entity, pos); break
        case 'cursedInfuser': useCursedInfuser(level, inv, pos[key], entity); break
        case 'composter': useComposter(level, inv, pos, entity); break
    }
}
function useCursedInfuser(level, inv, pos, entity) {
    let be = getContainerAt(level, pos)
    if (!be) return
    let did = []
    collectNearbyItems(level, inv, pos, did)
    let input = be.getItem(0)
    if (input.isEmpty()) {
        let mid = findInv(inv, cursedInfuserInputs)
        if (mid) {
            removeInv(inv, mid, 1)
            be.setItem(0, Item.of(mid))
            did.push('放入 ' + mid)
        }
    }
    if (did.length) debugItem(entity, '诅咒注入器 ' + did.join(', '))
}

// ---------- 学徒交互 ----------
global.apprenticeInteract = (ctx) => {
    const { entity, player } = ctx
    if (!player || player.level.isClientSide()) return
    let held = player.mainHandItem
    if (held.id === 'kubejs:smelt_list') {
        let list = listPositions(held)
        let pos = readPositions(entity)
        pos.furnaces = list.map(p => [p[0], p[1], p[2]])
        writePositions(entity, pos)
        player.tell('已设置学徒 ' + list.length + ' 个熔炉位置')
        return
    }
    if (held.id === 'kubejs:store_list') {
        let list = listPositions(held)
        let pos = readPositions(entity)
        pos.barrels = list.map(p => [p[0], p[1], p[2]])
        writePositions(entity, pos)
        player.tell('已设置学徒 ' + list.length + ' 个木桶位置')
        return
    }
    if (held.id !== 'goety:waystone') held = player.offHandItem
    if (held.id !== 'goety:waystone') return
    if (!$WaystoneItem.hasBlock(held)) return
    let blockPos = $WaystoneItem.getBlockPos(held)
    if (!blockPos) return
    let x = blockPos.getX(), y = blockPos.getY(), z = blockPos.getZ()
    let blockId = player.level.getBlock(x, y, z).id
    let key = null
    if (blockId === 'minecraft:crafting_table') key = 'workstation'
    else if (blockId === 'minecraft:furnace' || blockId === 'minecraft:blast_furnace' || blockId === 'minecraft:smoker') key = 'furnace'
    else if (blockId === 'minecraft:hopper') key = 'hopper'
    else if (blockId === 'minecraft:enchanting_table') key = 'enchantingTable'
    else if (blockId === 'goety:cursed_infuser') key = 'cursedInfuser'
    else if (blockId === 'supplementaries:pedestal' || blockId === 'goety:pedestal') key = 'pedestal'
    else if (blockId === 'goety:raiding_chest') key = 'raiderChest'
    else if (blockId === 'minecraft:chest' || blockId === 'minecraft:trapped_chest' || blockId === 'minecraft:barrel') key = 'chest'
    else if (blockId === 'minecraft:composter') key = 'composter'
    if (!key) {
        player.tell('学徒无法使用该方块')
        return
    }
    let pos = readPositions(entity)
    if (key === 'furnace') {
        pos.furnaces = [[x, y, z]]
    } else {
        pos[key] = [x, y, z]
    }
    writePositions(entity, pos)
    player.tell('已设置学徒的 ' + key + ' 位置')
}

// ---------- 学徒主 AI ----------
global.apprenticeAI = (entity) => {
    if (!entity.isGuardingArea()) {
        setTask(entity, taskNames.follow)
        return
    }
    let level = entity.level
    let pos = readPositions(entity)
    let inv = readInv(entity)
    polishGems(inv, entity)
    depositSurplus(entity, inv, pos)
    collectGroundItems(entity, inv)
    cleanupDemands(entity, inv, pos)
    if (handleAmethyst(entity, inv, pos)) {
        writeInv(entity, inv)
        return
    }
    if (stepPlan(entity, inv, pos)) {
        writeInv(entity, inv)
        return
    }
    if (thinkAndPlan(entity, inv, pos)) {
        writeInv(entity, inv)
        return
    }
    if (processDemand(entity, inv)) {
        writeInv(entity, inv)
        return
    }
    let mem = getMemory(entity)
    mem = mem.filter(key => hasPosition(pos, key) && needsWork(level, inv, pos, key))
    for (let key of positionPriority) {
        if (mem.length >= 5) break
        if (hasPosition(pos, key) && needsWork(level, inv, pos, key) && mem.indexOf(key) === -1) {
            mem.push(key)
        }
    }
    setMemory(entity, mem)
    let focus = mem[0]
    if (focus) {
        let p
        if (focus === 'furnaces') p = firstFurnaceNeedingWork(level, inv, pos)
        else if (focus === 'barrels') p = firstStoragePos(pos)
        else p = pos[focus]
        if (!p) {
            mem.shift()
            setMemory(entity, mem)
            setTask(entity, taskNames.idle)
            writeInv(entity, inv)
            return
        }
        let dx = entity.x - (p[0] + 0.5)
        let dy = entity.y - p[1]
        let dz = entity.z - (p[2] + 0.5)
        if (dx * dx + dy * dy + dz * dz > WORK_DIST_SQ) {
            entity.navigation.moveTo(p[0] + 0.5, p[1], p[2] + 0.5, 1.0)
            setTask(entity, '前往 ' + taskNames[focus])
            writeInv(entity, inv)
            return
        }
        doWork(entity, inv, pos, focus)
        setTask(entity, taskNames[focus])
        writeInv(entity, inv)
        return
    }
    let assigned = Object.keys(pos)
    setTask(entity, taskNames.idle + (assigned.length ? ' [已设:' + assigned.join(',') + ']\n' : ' [未设置任何位置]\n') + ' 背包: ' + formatInv(inv))
    writeInv(entity, inv)
}

// ---------- 导出给园丁等使用的函数 ----------
function exportG(map) {
    for (let k in map) global[k] = map[k]
}
exportG({
    mineralBlocks: mineralBlocks, polishMap: polishMap, recipes: recipes, pedestalTargets: pedestalTargets,
    smeltables: smeltables, smokerInputs: smokerInputs, fuels: fuels,
    cursedInfuserInputs: cursedInfuserInputs, FARM_RANGE: FARM_RANGE, farmCrops: farmCrops,
    planterBlocks: planterBlocks, planterCrops: planterCrops, planterSeedReserve: planterSeedReserve,
    toolItems: toolItems, itemReserve: itemReserve, seedItems: seedItems, roughGemShards: roughGemShards,
    isBlastInput: isBlastInput, isSmokerInput: isSmokerInput, isSmeltable: isSmeltable,
    furnaceTypeOf: furnaceTypeOf, findFurnaceInput: findFurnaceInput, isWorkItem: isWorkItem,
    getMemory: getMemory, setMemory: setMemory, getPedestalItem: getPedestalItem,
    useRaiderChest: useRaiderChest, useComposter: useComposter, depositNonWorkItems: depositNonWorkItems,
    depositSurplus: depositSurplus, useHopper: useHopper,
    getFurnaces: getFurnaces, hasPosition: hasPosition, furnaceNeedsWork: furnaceNeedsWork,
    firstFurnaceNeedingWork: firstFurnaceNeedingWork, furnaceInRange: furnaceInRange, distributeFuel: distributeFuel,
    useFurnaces: useFurnaces, useWorkstation: useWorkstation, polishGems: polishGems, enchant: enchant,
    isEnchantable: isEnchantable, isEnchantTarget: isEnchantTarget,
    pickaxeTiers: pickaxeTiers, pickaxeCraftOrder: pickaxeCraftOrder, readEnchants: readEnchants,
    pickaxeScore: pickaxeScore, pickaxeBaseEnchants: pickaxeBaseEnchants,
    pickaxeIdScore: pickaxeIdScore, pickaxeStackFor: pickaxeStackFor, bestPickaxeStack: bestPickaxeStack,
    planPickaxe: planPickaxe,
    getCropAge: getCropAge, findFarmTarget: findFarmTarget, findAmethystTarget: findAmethystTarget,
    handleAmethyst: handleAmethyst, storeHarvest: storeHarvest, harvestCrop: harvestCrop,
    harvestAmethyst: harvestAmethyst,
    handleFarming: handleFarming, findPlanterTarget: findPlanterTarget, harvestPlanterCrop: harvestPlanterCrop,
    handlePlanterFarming: handlePlanterFarming,
    findSugarcaneTarget: findSugarcaneTarget, harvestSugarcane: harvestSugarcane, handleSugarcane: handleSugarcane,
    findSilkTouchAxe: findSilkTouchAxe,
    findGourdTarget: findGourdTarget, harvestGourd: harvestGourd, handleGourd: handleGourd,
    recipeById: recipeById, recipesByOutput: recipesByOutput, roughForPolished: roughForPolished,
    cloneInv: cloneInv, availableCount: availableCount, applyStep: applyStep, applyPlan: applyPlan,
    planGetItem: planGetItem, findMissingMaterials: findMissingMaterials, findEnchantableItem: findEnchantableItem,
    planEnchant: planEnchant, planNetherite: planNetherite,
    getPlan: getPlan, setPlan: setPlan, describeStep: describeStep, executeStep: executeStep,
    doCursedInfuserStep: doCursedInfuserStep, findWaterSource: findWaterSource, doFillBucketStep: doFillBucketStep,
    stepPlan: stepPlan, getMaxStack: getMaxStack, demandThreshold: demandThreshold, thinkAndPlan: thinkAndPlan,
    positionPriority: positionPriority, needsWork: needsWork, doWork: doWork, useCursedInfuser: useCursedInfuser
})
})();
