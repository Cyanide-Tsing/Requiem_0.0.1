const $WaystoneItem = Java.loadClass('com.Polarice3.Goety.common.items.WaystoneItem')
const $EnchantmentHelper = Java.loadClass('net.minecraft.world.item.enchantment.EnchantmentHelper')
const $ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')
const $AABB = Java.loadClass('net.minecraft.world.phys.AABB')
const $ComposterBlock = Java.loadClass('net.minecraft.world.level.block.ComposterBlock')

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

// 加工配方（供“思考/规划”使用，模块化）
// in: 消耗, out: 产出, at: 'workstation'（工作台）| 'cursedInfuser'（诅咒注入器）。打磨单独处理（砂纸耐久 8）
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
    // 粒 ↔ 锭（用于多级需求模拟）
    list.push({ id: 'gold_ingot_to_nuggets', in: { 'minecraft:gold_ingot': 1 }, out: { 'minecraft:gold_nugget': 9 }, at: 'workstation', name: '分解金粒' })
    list.push({ id: 'gold_nuggets_to_ingot', in: { 'minecraft:gold_nugget': 9 }, out: { 'minecraft:gold_ingot': 1 }, at: 'workstation', name: '合成金锭' })
    list.push({ id: 'iron_ingot_to_nuggets', in: { 'minecraft:iron_ingot': 1 }, out: { 'minecraft:iron_nugget': 9 }, at: 'workstation', name: '分解铁粒' })
    list.push({ id: 'iron_nuggets_to_ingot', in: { 'minecraft:iron_nugget': 9 }, out: { 'minecraft:iron_ingot': 1 }, at: 'workstation', name: '合成铁锭' })
    list.push({ id: 'sandpaper', in: { 'minecraft:paper': 1, 'minecraft:sand': 1 }, out: { 'create:sand_paper': 1 }, at: 'workstation', name: '合成砂纸' })
    list.push({ id: 'rough_diamond_from_shards', in: { 'spelunkery:rough_diamond_shard': 9}, out: { 'spelunkery:rough_diamond': 1 }, at: 'workstation', name: '合成粗钻石' })
    list.push({ id: 'snap_seed', in: { 'goety:snap_fungus': 1 }, out: { 'goety:snap_warts': 4 }, at: 'workstation', name: '合成砰砰菌种子' })
    list.push({ id: 'netherite', in: { 'minecraft:netherite_scrap': 4, 'minecraft:gold_ingot': 4 }, out: { 'minecraft:netherite_ingot': 1 }, at: 'workstation', name: '合成下界合金' })
    // 工具合成
    list.push({ id: 'sticks', in: { 'minecraft:oak_planks': 2 }, out: { 'minecraft:stick': 4 }, at: 'workstation', name: '合成木棍' })
    // 炼药材料（园丁）
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
    // 诅咒注入器配方
    list.push({ id: 'cursed_ingot', in: { 'minecraft:iron_ingot': 1 }, out: { 'goety:cursed_ingot': 1 }, at: 'cursedInfuser', name: '注入诅咒锭' })
    list.push({ id: 'magic_emerald', in: { 'minecraft:emerald': 1 }, out: { 'goety:magic_emerald': 1 }, at: 'cursedInfuser', name: '注入魔法绿宝石' })
    list.push({ id: 'empty_focus', in: { 'minecraft:amethyst_shard': 1 }, out: { 'goety:empty_focus': 1 }, at: 'cursedInfuser', name: '注入空法术聚晶' })
    //食物合成
    list.push({ id: 'wart_bread', in: { 'farmersdelight:wheat_dough': 1, 'minecraft:nether_wart': 1}, out: { 'kubejs:wart_bread': 1 }, at: 'workstation', name: '合成下界面包' })
    // 工作台配方（高级合成）
    list.push({ id: 'soul_emerald', in: { 'goety:magic_emerald': 8, 'goety:empty_focus': 1 }, out: { 'goety:soul_emerald': 1 }, at: 'workstation', name: '合成灵魂绿宝石' })
    list.push({ id: 'pale_steel_ingot', in: { 'goety:cursed_ingot': 1, 'minecraft:iron_ingot': 1, 'minecraft:lapis_lazuli': 1, 'minecraft:coal': 1 }, out: { 'goety:pale_steel_ingot': 2 }, at: 'workstation', name: '合成苍白钢锭' })
    list.push({ id: 'diamond_pickaxe', in: { 'minecraft:diamond': 3, 'minecraft:stick': 2}, out: { 'minecraft:diamond_pickaxe': 1 }, at: 'workstation', name: '合成钻石镐' })
    // 工具与工具配方（工具不消耗）
    list.push({ id: 'bucket', in: { 'minecraft:iron_ingot': 3 }, out: { 'minecraft:bucket': 1 }, at: 'workstation', name: '合成铁桶' })
    list.push({ id: 'fill_bucket', in: { 'minecraft:bucket': 1 }, out: { 'minecraft:water_bucket': 1 }, at: 'water', name: '装水' })
    list.push({ id: 'pulverize_focus', in: { 'goety:empty_focus': 1, 'minecraft:iron_block': 3, 'minecraft:oak_log': 1 }, out: { 'goety:pulverize_focus': 1 }, at: 'workstation', name: '合成瓦解聚晶' })
    list.push({ id: 'wheat_dough', in: { 'minecraft:water_bucket': 1, 'minecraft:wheat': 1 }, out: { 'farmersdelight:wheat_dough': 1, 'minecraft:bucket': 1 }, at: 'workstation', name: '合成面团' })
    list.push({ id: 'stone_to_cobblestone', in: { 'minecraft:stone': 1 }, tool: 'goety:pulverize_focus', out: { 'minecraft:cobblestone': 1 }, at: 'workstation', name: '粉碎石头' })
    list.push({ id: 'cobblestone_to_gravel', in: { 'minecraft:cobblestone': 1 }, tool: 'goety:pulverize_focus', out: { 'minecraft:gravel': 1 }, at: 'workstation', name: '粉碎圆石' })
    list.push({ id: 'gravel_to_sand', in: { 'minecraft:gravel': 1 }, tool: 'goety:pulverize_focus', out: { 'minecraft:sand': 1 }, at: 'workstation', name: '粉碎沙砾' })
    return list
})()

// 基座（Pedestal）过滤：基座上的物品 -> 目标配方 id
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

// 高炉输入（矿石/粗金属，烧炼更快）
const smeltables = [
    'minecraft:iron_ore', 'minecraft:deepslate_iron_ore', 'minecraft:raw_iron',
    'minecraft:gold_ore', 'minecraft:deepslate_gold_ore', 'minecraft:raw_gold',
    'minecraft:copper_ore', 'minecraft:deepslate_copper_ore', 'minecraft:raw_copper',
    'minecraft:ancient_debris', 'minecraft:nether_gold_ore'
]

// 烟熏炉输入（肉类/食物，烧炼更快）
const smokerInputs = [
    'minecraft:beef', 'minecraft:porkchop', 'minecraft:chicken',
    'minecraft:mutton', 'minecraft:rabbit', 'minecraft:cod',
    'minecraft:salmon', 'minecraft:potato', 'minecraft:kelp'
]

// 燃料
const fuels = ['minecraft:coal', 'minecraft:charcoal', 'minecraft:coal_block']

// 诅咒注入器输入（简化清单，实际可用 tag 匹配更多）
const cursedInfuserInputs = [
    'minecraft:iron_ingot', 'minecraft:emerald', 'minecraft:calcite',
    'minecraft:amethyst_shard', 'minecraft:stone'
]

// 农田作物（8 格内自动收割 + 补种）
const FARM_RANGE = 8
const farmCrops = {
    'minecraft:nether_wart': { maxAge: 3, seed: 'minecraft:nether_wart', harvest: 'minecraft:nether_wart', keepHarvest: false },
    'goety:snap_warts': { maxAge: 2, seed: 'goety:snap_warts', harvest: 'goety:snap_fungus', keepHarvest: true }
}

// 种植盆作物（原版 + 农夫乐事）；作物在种植盆上方一格
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
// 需要保留种子的作物（种子 ≠ 收获物，掉落可能没有种子）
const planterSeedReserve = {
    'minecraft:wheat_seeds': 8,
    'minecraft:beetroot_seeds': 8,
    'farmersdelight:cabbage_seeds': 8,
    'farmersdelight:tomato_seeds': 8
}

// 工具（会在合成中用到但通常不消耗，需要保留）
const toolItems = ['minecraft:bucket', 'minecraft:water_bucket', 'goety:pulverize_focus']

// 工作物品保留数量（超过则存回箱子）
const itemReserve = {
    'goety:snap_warts': 8,
    'minecraft:amethyst_shard': 16,
    'goety:pulverize_focus': 1
}
for (let s in planterSeedReserve) itemReserve[s] = planterSeedReserve[s]

// 可堆肥的种子（箱子+身上合计超过一组后，多余的投入堆肥桶）
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

// 粗钻石碎片（9 碎片 -> 1 粗钻石）的输入，需要作为工作物品保留
const roughGemShards = ['spelunkery:rough_diamond_shard']


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

// ---------- 可烧炼物品分类 ----------
function isBlastInput(id) { return smeltables.indexOf(id) !== -1 }
function isSmokerInput(id) { return smokerInputs.indexOf(id) !== -1 }
function isSmeltable(id) { return isBlastInput(id) || isSmokerInput(id) }
// 根据方块类型返回炉型：'blast' | 'smoker' | 'furnace'
function furnaceTypeOf(level, p) {
    if (!p) return 'furnace'
    let bc = level.getBlock(p[0], p[1], p[2])
    if (!bc) return 'furnace'
    if (bc.id === 'minecraft:blast_furnace') return 'blast'
    if (bc.id === 'minecraft:smoker') return 'smoker'
    return 'furnace'
}
// 从背包中为指定炉型找一个可烧炼物品
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

// 学徒“会用到/保留”的物品（其余才会存进箱子）
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

// ---------- 记忆（专注队列，长度 5） ----------
// memory 存的是“任务树”的根任务 key（最多 5 个），仆从一次专注队首一个任务；
// 队首任务被堵住/完成就弹出，再按优先级补充新的任务。
function getMemory(entity) {
    let s = entity.persistentData.getString('memory')
    return s ? JSON.parse(s) : []
}
function setMemory(entity, mem) {
    entity.persistentData.putString('memory', JSON.stringify(mem))
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

// 把容器 slot 里的物品全部收进库存
function drainContainerSlot(level, inv, pos, slot) {
    let be = getContainerAt(level, pos)
    if (!be) return
    let stack = be.getItem(slot)
    if (!stack.isEmpty()) {
        addInv(inv, stack.id, stack.count)
        be.setItem(slot, $ItemStack.EMPTY)
    }
}

// ---------- 列表物品（烧炼列表 / 存储列表）记录位置 ----------
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

// 右键方块：把方块位置记录进列表物品
BlockEvents.rightClicked(event => {
    let player = event.player
    if (!player || player.level.isClientSide()) return
    let held = player.mainHandItem
    if (held.id === 'kubejs:smelt_list') {
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
    }
})

// ---------- 指路石交互 ----------
global.apprenticeInteract = (ctx) => {
    const { entity, player } = ctx
    if (!player || player.level.isClientSide()) return
    let held = player.mainHandItem

    // 列表物品：应用记录的位置到学徒（清除旧位置并替换）
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

// ---------- 行为：袭击者箱子/箱子/木桶存取 ----------
function useRaiderChest(level, inv, pos, entity) {
    let containers = getStorageContainers(level, pos)
    if (!containers.length) return
    let did = []
    // 打开箱子动画
    try { entity.triggerAnim('interact', 'interact') } catch (e) {}
    // 把库存里非工作物品存入（跨所有存储容器，同类/同类别分组）
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
    // 从存储容器取出工作物品；保留数量的物品只取到保留上限（避免存取死循环）
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
function findEmptySlot(be) {
    for (let i = 0; i < be.getContainerSize(); i++) {
        if (be.getItem(i).isEmpty()) return i
    }
    return -1
}

// 把物品存入容器，合并同类可堆叠物品，不超过堆叠上限；返回未存入的数量
function depositStackToContainer(be, id, count) {
    let maxStack = 64
    try {
        let probe = Item.of(id)
        if (probe && probe.getMaxStackSize) maxStack = probe.getMaxStackSize()
    } catch (e) {}
    // 先合并到已有同类堆叠
    for (let i = 0; i < be.getContainerSize() && count > 0; i++) {
        let s = be.getItem(i)
        if (!s.isEmpty() && s.id === id && s.count < maxStack) {
            let add = Math.min(maxStack - s.count, count)
            be.setItem(i, Item.of(id, s.count + add))
            count -= add
        }
    }
    // 剩余放入空槽
    while (count > 0) {
        let slot = findEmptySlot(be)
        if (slot === -1) break
        let put = Math.min(maxStack, count)
        be.setItem(slot, Item.of(id, put))
        count -= put
    }
    return count
}
function getStorageChest(level, pos) {
    return getStorageContainers(level, pos)[0] || null
}

// 存储容器列表（木桶 + 箱子 + 袭击者箱子，去重）
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

// 返回一个用于导航的存储位置（木桶优先）
function firstStoragePos(pos) {
    if (pos.barrels && pos.barrels.length) return pos.barrels[0]
    if (pos.chest) return pos.chest
    if (pos.raiderChest) return pos.raiderChest
    return null
}

// ---------- 物品分类（用于木桶分组）：7 大类 ----------
// 1 矿物（粒/锭/块/宝石/矿石/粉末 + 紫水晶），2 巫法材料，3 工具武器，4 护甲，5 食物，6 作物，7 作物种子
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
// 容器对某物品的匹配度：0=已有同类物品，1=已有同类别，2=空桶，3=有其他物品但有空位，4=已满
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
// 跨多个存储容器存入物品（优先同类/同类别，装满后溢出到别的桶）；返回未存入数量
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

// 读取基座（Pedestal）上的展示物品 id，无则返回 null
function getPedestalItem(level, pos) {
    if (!pos.pedestal) return null
    let be = getContainerAt(level, pos.pedestal)
    if (!be) return null
    let stack = be.getItem(0)
    return stack && !stack.isEmpty() ? stack.id : null
}

// 从容器中取出指定数量的物品，返回实际取出数量
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

// 跨所有存储容器取出指定数量的物品，返回实际取出数量
function removeFromStorage(level, pos, id, count) {
    let removed = 0
    for (let be of getStorageContainers(level, pos)) {
        if (removed >= count) break
        removed += removeFromContainer(be, id, count - removed)
    }
    return removed
}

// ---------- 行为：堆肥桶 ----------
// 箱子 + 身上合计超过一组（64）的种子，把多余的一个投入堆肥桶
function useComposter(level, inv, pos, entity) {
    let bc = level.getBlock(pos.composter[0], pos.composter[1], pos.composter[2])
    if (!bc || bc.id !== 'minecraft:composter') return
    let cpos = new BlockPos(pos.composter[0], pos.composter[1], pos.composter[2])
    let props = bc.getProperties()
    let lvl = parseInt(props.get('level') || '0')
    // 堆肥桶满（level 8）时取出骨粉（掉落为物品实体后拾取）
    if (lvl >= 8) {
        try {
            $ComposterBlock.extractProduce(entity, bc.getBlockState(), level, cpos)
        } catch (e) {}
        let did = []
        collectNearbyItems(level, inv, pos.composter, did)
        if (did.length) debugItem(entity, '堆肥桶 ' + did.join(', '))
        return
    }
    if (lvl >= 7) return // 堆肥桶快满（即将产出骨粉）
    let chestInv = getChestInvMap(level, pos)
    for (let seedId of seedItems) {
        let total = (inv[seedId] || 0) + (chestInv[seedId] || 0)
        if (total <= 64) continue
        // 优先从存储容器取 1 个种子，否则从背包取
        let removed = removeFromStorage(level, pos, seedId, 1)
        if (!removed && !removeInv(inv, seedId, 1)) continue
        try {
            $ComposterBlock.insertItem(entity, bc.getBlockState(), level, Item.of(seedId, 1), cpos)
        } catch (e) {}
        debugItem(entity, '堆肥 1x ' + seedId)
        return
    }
}

// 定期把背包里非工作物品存入注册箱子（背景工序）
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

// 把超出保留数量的工作物品存回箱子（背景工序）
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

// ---------- 行为：漏斗取物 ----------
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

// ---------- 行为：熔炉（多炉，按炉型选料，平均分配燃料） ----------
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

// 某个熔炉是否需要处理（取产物/加燃料/放料）
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
// 返回第一个需要处理的熔炉位置（用于导航），无则 null
function firstFurnaceNeedingWork(level, inv, pos) {
    for (let p of getFurnaces(pos)) {
        if (furnaceNeedsWork(level, inv, p)) return p
    }
    return null
}
// 熔炉是否在学徒可操作范围内
function furnaceInRange(level, entity, p) {
    let dx = entity.x - (p[0] + 0.5)
    let dy = entity.y - p[1]
    let dz = entity.z - (p[2] + 0.5)
    return dx * dx + dy * dy + dz * dz <= WORK_DIST_SQ
}

// 平均分配燃料到需要燃料的熔炉
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
    // 平均份额（至少 1），单炉最多 64
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
    // 只处理学徒附近的熔炉，远处的炉子交给后续导航逐台前往
    let furnaces = getFurnaces(pos).filter(p => furnaceInRange(level, entity, p))
    if (furnaces.length === 0) return
    let did = []
    // 1. 取各炉输出（只要在操作该炉，就顺手取走，避免输出栏堵塞下一轮）
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
    // 2. 平均分配燃料
    distributeFuel(level, inv, furnaces, did)
    // 3. 按炉型分配输入（粗金属->高炉，肉类->烟熏炉）
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

// ---------- 行为：工作台合成 ----------
function useWorkstation(inv, entity) {
    let did = []
    // 9 锭 -> 块（仅当锭数 >= 半组 32 才压缩，避免把少量锭合成块）
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
    // 合成砂纸（批量：纸 + 沙子）
    let paper = inv['minecraft:paper'] || 0
    let sand = inv['minecraft:sand'] || 0
    let count = Math.min(paper, sand)
    if (count > 0) {
        removeInv(inv, 'minecraft:paper', count)
        removeInv(inv, 'minecraft:sand', count)
        addInv(inv, 'create:sand_paper', count)
        did.push(count + 'x create:sand_paper')
    }
    // 砰砰菌真菌 -> 4 砰砰菌种子（批量）
    let fungus = inv['goety:snap_fungus'] || 0
    if (fungus > 0) {
        removeInv(inv, 'goety:snap_fungus', fungus)
        addInv(inv, 'goety:snap_warts', fungus * 4)
        did.push(fungus + 'x goety:snap_fungus -> ' + (fungus * 4) + 'x goety:snap_warts')
    }
    // 粗钻石碎片 -> 粗钻石（9 碎片批量）
    let shards = inv['spelunkery:rough_diamond_shard'] || 0
    let roughCount = Math.floor(shards / 9)
    if (roughCount > 0) {
        removeInv(inv, 'spelunkery:rough_diamond_shard', roughCount * 9)
        addInv(inv, 'spelunkery:rough_diamond', roughCount)
        did.push(roughCount + 'x spelunkery:rough_diamond')
    }
    if (did.length) debugItem(entity, '合成 ' + did.join(', '))
}

// ---------- 行为：砂纸打磨 rough gem ----------
function polishGems(inv, entity) {
    let sandpaper = inv['create:sand_paper'] || 0
    if (sandpaper < 1) return
    let did = []
    for (let rough in polishMap) {
        // 1 张砂纸打磨 8 个宝石
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

// ---------- 行为：30 级附魔（消耗青金石） ----------
function enchant(level, inv, entity, pos) {
    if ((inv['minecraft:lapis_lazuli'] || 0) < 3) return
    for (let id in inv) {
        let stack = Item.of(id)
        if (stack.isEmpty()) continue
        // 只对可附魔物品（工具/装备/书），且不是镐
        if (!isEnchantTarget(id)) continue
        removeInv(inv, id, 1)
        removeInv(inv, 'minecraft:lapis_lazuli', 3)
        let enchanted = $EnchantmentHelper.enchantItem(level.random, stack, 30, false)
        // 附魔完的物品放进存储容器（保留附魔 NBT）
        for (let be of getStorageContainers(level, pos)) {
            let slot = findEmptySlot(be)
            if (slot !== -1) {
                be.setItem(slot, enchanted)
                debugItem(entity, '附魔 ' + enchanted.id + ' 已存入箱子')
                return
            }
        }
        // 无箱子 / 箱子满时暂存背包
        addInv(inv, enchanted.id, 1)
        debugItem(entity, '附魔 ' + enchanted.id + '（无箱子或箱子满，暂存背包）')
        return
    }
}
function isEnchantable(id) {
    return id.indexOf('sword') !== -1 || id.indexOf('pickaxe') !== -1 || id.indexOf('axe') !== -1 ||
        id.indexOf('shovel') !== -1 || id.indexOf('hoe') !== -1 || id.indexOf('helmet') !== -1 ||
        id.indexOf('chestplate') !== -1 || id.indexOf('leggings') !== -1 || id.indexOf('boots') !== -1 ||
        id.indexOf('book') !== -1 || id.indexOf('bow') !== -1
}

// ---------- 镐（学徒工具） ----------
// 镐的基础等级（越高越好）
const pickaxeTiers = {
    'minecraft:iron_pickaxe': 2,
    'minecraft:diamond_pickaxe': 3,
    'kubejs:pale_metal_pickaxe': 4
}
// 附魔目标：可附魔且不是镐（镐由学徒按固定附魔管理，避免洗掉时运等）
function isEnchantTarget(id) {
    return isEnchantable(id) && pickaxeTiers[id] === undefined
}
// 制作优先级（从优到劣）；recipe 对应 recipes 列表里的配方 id
const pickaxeCraftOrder = [
    { id: 'kubejs:pale_metal_pickaxe', recipe: 'pale_steel_pickaxe' },
    { id: 'minecraft:diamond_pickaxe', recipe: 'diamond_pickaxe' },
    { id: 'minecraft:iron_pickaxe', recipe: 'iron_pickaxe' }
]
// 读取物品附魔（附魔 id -> 等级）
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
// 镐评分：等级 + 附魔加权（时运最值钱，精准采集对采紫水晶是负收益）
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
// 镐的固定附魔（pale 镐由配方自带）；普通镐无附魔
const pickaxeBaseEnchants = {
    'kubejs:pale_metal_pickaxe': { 'minecraft:fortune': 4, 'minecraft:efficiency': 3, 'minecraft:unbreaking': 4 }
}
// 仅按 id 估算评分（用于规划，忽略随机附魔）
function pickaxeIdScore(id) {
    return pickaxeScore(id, pickaxeBaseEnchants[id] || {})
}
// 由 id 构造镐物品（带已知附魔）
function pickaxeStackFor(id) {
    let stack = Item.of(id)
    let ench = pickaxeBaseEnchants[id] || {}
    for (let e in ench) stack = stack.enchant(e, ench[e])
    return stack
}
// 评分最高的镐（背包 + 存储容器），返回 ItemStack 或 null
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
// 为制作合适的镐生成计划（材料来自背包 + 存储容器；木棍按需合成）
function planPickaxe(entity, level, pos, inv, chestInv) {
    let currentBest = bestPickaxeStack(level, pos, inv)
    let currentScore = currentBest ? pickaxeScore(currentBest.id, readEnchants(currentBest)) : -1
    for (let p of pickaxeCraftOrder) {
        if (pickaxeIdScore(p.id) <= currentScore) continue
        let r = recipeById(p.recipe)
        if (!r) continue
        // 硬材料需直接可用；木棍允许按需合成
        let enough = true
        for (let k in r.in) {
            if (k === 'minecraft:stick') continue
            if (availableCount(inv, chestInv, k) < r.in[k]) { enough = false; break }
        }
        if (!enough) {
            // 只对当前最优可升级配方发起一次需求（含其全部缺失叶子材料）
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

// ---------- 农田：8 格内收割作物 / 采集紫水晶 ----------
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
                // snap_warts 需要种子才能补种，无种子则跳过
                if (crop.seed !== crop.harvest && (inv[crop.seed] || 0) < 1) continue
                if (getCropAge(bc) >= crop.maxAge) {
                    return { type: 'crop', id: bc.id, x: x, y: y, z: z, bc: bc }
                }
            }
    return null
}

// 采集紫水晶（学徒保留的职能）
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
    // 掉落物（成熟状态下读取）
    let drops = bc.getDrops() || []
    let harvestCount = 0
    for (let stack of drops) {
        if (stack.id === crop.harvest) harvestCount += stack.count
    }
    // 补种：age 设回 0，保留 facing
    let props = bc.getProperties()
    let newProps = { age: '0' }
    let facing = props.get('facing')
    if (facing !== null && facing !== undefined) newProps.facing = facing
    bc.set(target.id, newProps, 3)
    // 种子消耗
    if (crop.seed === crop.harvest) {
        harvestCount = Math.max(0, harvestCount - 1) // 下界疣：扣 1 个做种
    } else {
        removeInv(inv, crop.seed, 1) // snap_warts：消耗 1 个种子
    }
    // 收获处理：需要合成的（snap_fungus）留在背包，其余存箱
    if (harvestCount > 0) {
        if (crop.keepHarvest) addInv(inv, crop.harvest, harvestCount)
        else storeHarvest(level, pos, inv, crop.harvest, harvestCount)
    }
    debugItem(entity, '收割 ' + target.id + ' 得 ' + harvestCount + 'x ' + crop.harvest)
}

function harvestAmethyst(level, inv, target, entity, pos) {
    // 有镐时用镐挖掘，得到正确掉落（镐 -> 4 碎片，时运加成）；无镐则空手 2 碎片
    let pickaxe = bestPickaxeStack(level, pos, inv)
    let drops = pickaxe ? (target.bc.getDrops(entity, pickaxe) || []) : (target.bc.getDrops() || [])
    // 用 getDrops 已拿到掉落，destroyBlock 不再掉落（drop=false），避免重复
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

// ---------- 种植盆：收割 + 补种 ----------
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
    // 补种：重置 age 为 0，保留附加属性
    let props = bc.getProperties()
    let newProps = { age: '0' }
    let ropelogged = props.get('ropelogged')
    if (ropelogged !== null && ropelogged !== undefined) newProps.ropelogged = ropelogged
    let supporting = props.get('supporting')
    if (supporting !== null && supporting !== undefined) newProps.supporting = supporting
    bc.set(target.cropId, newProps, 3)
    // 种子消耗（掉落里优先扣 1 个种子，否则从背包扣）
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

// ---------- 甘蔗：高度>2 只割上部，保留根部；20% 双倍收获 ----------
function findSugarcaneTarget(level, entity) {
    let bx = Math.floor(entity.x), by = Math.floor(entity.y), bz = Math.floor(entity.z)
    for (let dy = -FARM_RANGE; dy <= FARM_RANGE; dy++)
        for (let dz = -FARM_RANGE; dz <= FARM_RANGE; dz++)
            for (let dx = -FARM_RANGE; dx <= FARM_RANGE; dx++) {
                let x = bx + dx, y = by + dy, z = bz + dz
                let bc = level.getBlock(x, y, z)
                if (!bc || bc.id !== 'minecraft:sugar_cane') continue
                // 只找基座（下方不是甘蔗）
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

// ---------- 西瓜/南瓜：优先精准采集斧头 ----------
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

// ---------- 思考/规划系统 ----------
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
        // 砂纸耐久 8：磨 count 个宝石消耗 ceil(count/8) 张砂纸
        let polished = polishMap[step.rough]
        inv[step.rough] = (inv[step.rough] || 0) - step.count
        inv['create:sand_paper'] = (inv['create:sand_paper'] || 0) - Math.ceil(step.count / 8)
        inv[polished] = (inv[polished] || 0) + step.count
    }
}
function applyPlan(inv, chestInv, plan) {
    for (let step of plan) applyStep(inv, chestInv, step)
}

// 读取箱子内容（所有物品，未附魔）
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

// 反向规划：获得 item 数量 count（返回步骤数组或 null）
// produce=true 时，该 item 必须通过配方生产，不从箱子取也不视作已有（用于 goal 物品）
function planGetItem(inv, chestInv, item, count, depth, visited, produce) {
    if (depth > 8) return null
    if (!produce && (inv[item] || 0) >= count) return []
    if (visited.indexOf(item) !== -1) return null
    if (!produce) {
        // 直接从箱子拿
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
    // 通过配方（批量）
    for (let r of recipesByOutput(item)) {
        let times = Math.ceil(count / (r.out[item] || 1))
        let ni = cloneInv(inv), nc = cloneInv(chestInv)
        let nv = visited.concat(item)
        let subPlans = []
        let ok = true
        // 工具（不消耗）：确保背包里有工具
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
            // 诅咒注入器/装水：一次只能处理一个
            for (let i = 0; i < times; i++) plan.push({ a: 'craft', recipe: r.id })
        } else {
            plan.push({ a: 'craft', recipe: r.id, count: times })
        }
        return plan
    }
    // 打磨（砂纸耐久 8）
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

// 找到配方树中所有缺失的叶子材料（不可再合成且不够），用于需求系统
// produce=true 时目标物品必须生产，忽略其自身库存（用于台座/镐等 goal 物品）
function findMissingMaterials(inv, chestInv, item, count, depth, visited, out, produce) {
    out = out || []
    if (depth > 8) return out
    if (visited.indexOf(item) !== -1) return out
    if (!produce && (inv[item] || 0) + (chestInv[item] || 0) >= count) return out
    let rs = recipesByOutput(item)
    if (rs.length) {
        let r = rs[0]
        let times = Math.ceil(count / (r.out[item] || 1))
        // 工具（不消耗）：缺失时也作为缺失材料（与 planGetItem 保持一致）
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
    // 批量检测：最多能合成多少下界合金（金块可分解为 9 金锭）
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

// 计划存储
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
        if (r.tool && (inv[r.tool] || 0) < 1) enough = false // 工具（不消耗）需在背包
        if (enough) {
            for (let k in r.in) removeInv(inv, k, r.in[k] * times)
            // 手上持有正在处理的物品/工具
            setHeldItem(entity, r.tool || Object.keys(r.in)[0] || Object.keys(r.out)[0])
            if (r.make) {
                // NBT 产物：直接存入存储容器
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
                    // 箱子满/无箱子：暂存背包（丢 NBT）
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

// 诅咒注入器步骤（阻塞）：放入输入、拾取产物；返回 true 表示步骤完成
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

// 找水源（水方块或装满水的炼药锅），返回 [x, y, z] 或 null
function findWaterSource(level, entity) {
    let bx = Math.floor(entity.x), by = Math.floor(entity.y), bz = Math.floor(entity.z)
    for (let dy = -FARM_RANGE; dy <= FARM_RANGE; dy++)
        for (let dz = -FARM_RANGE; dz <= FARM_RANGE; dz++)
            for (let dx = -FARM_RANGE; dx <= FARM_RANGE; dx++) {
                let x = bx + dx, y = by + dy, z = bz + dz
                let bc = level.getBlock(x, y, z)
                if (!bc) continue
                if (bc.id === 'minecraft:water' || bc.id === 'minecraft:water_cauldron') return [x, y, z]
            }
    return null
}

// 装水：消耗水源，空桶 -> 水桶
function doFillBucketStep(level, inv, entity, water, recipe) {
    let x = water[0], y = water[1], z = water[2]
    let bc = level.getBlock(x, y, z)
    if (!bc) return
    // 消耗水
    if (bc.id === 'minecraft:water') {
        bc.set('minecraft:air')
    } else if (bc.id === 'minecraft:water_cauldron') {
        let props = bc.getProperties()
        let lvl = parseInt(props.get('level') || '3')
        if (lvl <= 1) bc.set('minecraft:cauldron')
        else bc.set('minecraft:water_cauldron', { level: String(lvl - 1) })
    }
    // 装水
    for (let k in recipe.in) removeInv(inv, k, recipe.in[k])
    for (let k in recipe.out) addInv(inv, k, recipe.out[k])
    setHeldItem(entity, 'minecraft:bucket')
    debugItem(entity, '装水')
}

// 执行计划中的下一步（返回 true 表示正在执行计划）
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
    // 诅咒注入器：阻塞步骤
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

// 物品最大堆叠
function getMaxStack(id) {
    try {
        let s = Item.of(id)
        if (s && !s.isEmpty() && s.getMaxStackSize) return s.getMaxStackSize()
    } catch (e) {}
    return 64
}
// 需求阈值：不可堆叠(1)时为 1，可堆叠物品为 1/2 最大堆叠
function demandThreshold(id) {
    return Math.max(1, Math.floor(getMaxStack(id) / 2))
}

// 思考：为可达成目标生成计划（多级需求：基座 + 镐 + 下界合金都参与）
function thinkAndPlan(entity, inv, pos) {
    let level = entity.level
    let chestInv = getChestInvMap(level, pos)
    // 基座过滤：仅制作基座上的物品
    let pedestalItem = getPedestalItem(level, pos)
    if (pedestalItem && pedestalTargets[pedestalItem]) {
        // 台座物品更新：清除旧需求，强制重新发起一次需求尝试
        let lastPedestal = entity.persistentData.getString('lastPedestal')
        if (lastPedestal !== pedestalItem) {
            entity.persistentData.putString('lastPedestal', pedestalItem)
            clearDemand(entity)
        }
        // 仓储中该物品已达阈值则不处理，但继续检查其他自动需求
        if (availableCount(inv, chestInv, pedestalItem) >= demandThreshold(pedestalItem)) {
            // 已达阈值，跳过本次基座合成
        } else {
            let plan = planGetItem(inv, chestInv, pedestalItem, 1, 0, [], true)
            if (plan && plan.length) {
                plan.push({ a: 'deposit', item: pedestalItem, count: 1 })
                setPlan(entity, plan)
                setTask(entity, '思考 ' + plan.map(describeStep).join(' → '))
                return true
            }
            // 缺材料：触发需求（与其他自动需求并存轮询）
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
    // 纸需求：有粗宝石要打磨（需砂纸）但缺纸时，向园丁要纸
    let needPaper = false
    for (let rough in polishMap) {
        if ((inv[rough] || 0) > 0) { needPaper = true; break }
    }
    if (needPaper && (inv['minecraft:paper'] || 0) === 0 && (chestInv['minecraft:paper'] || 0) === 0) {
        requestMaterials(entity, 'minecraft:paper', ['minecraft:paper'])
    }
    return false
}

// ---------- 寻路 ----------
const positionPriority = ['hopper', 'chest', 'raiderChest', 'barrels', 'furnaces', 'workstation', 'cursedInfuser', 'composter']
const WORK_DIST_SQ = 6.25 // 约 2.5 格内视为到达
const FURNACE_OUTPUT_THRESHOLD = 16 // 熔炉产物攒够 16 个才取一次

function needsWork(level, inv, pos, key) {
    let p = pos[key]
    // 熔炉：列表形式（可能为空数组）
    if (key === 'furnaces') {
        for (let fp of getFurnaces(pos)) {
            if (furnaceNeedsWork(level, inv, fp)) return true
        }
        return false
    }
    if (!p) return false
    // 基座过滤时，禁用专注队列的诅咒注入器/工作台（改由规划系统处理）
    let pedestalItem = getPedestalItem(level, pos)
    if (pedestalItem && pedestalTargets[pedestalItem]) {
        if (key === 'cursedInfuser' || key === 'workstation') return false
    }
    // 工作台/附魔台不是容器方块实体，无需容器判定
    if (key === 'workstation') {
        for (let ingot in mineralBlocks) if ((inv[ingot] || 0) >= 9) return true
        if ((inv['goety:snap_fungus'] || 0) >= 1) return true
        if ((inv['spelunkery:rough_diamond_shard'] || 0) >= 9) return true
        return (inv['minecraft:paper'] || 0) >= 1 && (inv['minecraft:sand'] || 0) >= 1
    }
    if (key === 'enchantingTable') return false // 附魔改由规划系统处理
    // 堆肥桶：满（level 8）时取出骨粉，或箱子 + 身上合计超过一组种子时需要处理
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
    // 箱子/袭击者箱子/木桶：跨所有存储容器判断
    if (key === 'chest' || key === 'raiderChest' || key === 'barrels') {
        let containers = getStorageContainers(level, pos)
        if (!containers.length) return false
        // 有空位 + 有非工作物品需要存
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
        // 有未附魔的工作物品可取（保留数量只取到上限）
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
            // 输入为空且有可注入材料，或附近有掉落产物
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

// ---------- 调试：报告当前任务给主人 ----------
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

// ---------- 仆从命名 ----------
const servantNames = ['凯特', '艾拉', '莉娅', '米娅', '索菲', '露西', '奥莉', '格雷', '菲恩', '诺拉']
function getServantName(entity) {
    let n = entity.persistentData.getString('ServantName')
    return n || '学徒'
}
function assignServantName(entity) {
    if (entity.persistentData.getString('ServantName')) return
    let idx = Math.abs(entity.id) % servantNames.length
    let name = servantNames[idx]
    entity.persistentData.putString('ServantName', name)
    try { entity.setCustomName(Text.of(name)); entity.setCustomNameVisible(true) } catch (e) {}
}
// 仆从标签：用于主人可见的消息，例如「学徒·凯特」
function servantLabel(entity) {
    let name = getServantName(entity)
    let type = entity.type === 'kubejs:gardener' ? '园丁' : '学徒'
    return type + '·' + name
}

function tellOwner(entity, task) {
    let owner = entity.getTrueOwner()
    if (owner && owner.isPlayer()) {
        owner.tell(Text.of('§7[' + servantLabel(entity) + '] ' + task))
    }
}

function setTask(entity, task) {
    if (entity.persistentData.getString('currentTask') === task) return
    entity.persistentData.putString('currentTask', task)
    //tellOwner(entity, task)
}

// 操作物品的调试输出
function debugItem(entity, msg) {
    let owner = entity.getTrueOwner()
    if (owner && owner.isPlayer()) {
        owner.tell(Text.of('§b[' + servantLabel(entity) + '] ' + msg))
    }
}

// 让学徒在手上持有物品
function setHeldItem(entity, id) {
    if (!id) return
    try { entity.setMainHandItem(Item.of(id)) } catch (e) {}
}

// 背包内容转字符串
function formatInv(inv) {
    let parts = []
    for (let id in inv) {
        if (inv[id] > 0) parts.push(id + ' x' + inv[id])
    }
    return parts.length ? parts.join(', ') : '空'
}

// ---------- 主 AI ----------
global.apprenticeAI = (entity) => {
    // 仅在警戒（工作）模式下执行自动化；跟随模式交由 goety 仆从逻辑
    if (!entity.isGuardingArea()) {
        setTask(entity, taskNames.follow)
        return
    }

    let level = entity.level
    let pos = readPositions(entity)
    let inv = readInv(entity)

    // 背景工序：砂纸打磨（无需方块）
    polishGems(inv, entity)
    // 背景工序：把超出保留数量的工作物品存回箱子
    depositSurplus(entity, inv, pos)
    // 背景工序：拾取附近掉落在地上的物品（作物、骨粉等）
    collectGroundItems(entity, inv)
    // 背景工序：清理已满足的需求
    cleanupDemands(entity, inv, pos)

    // 紫水晶：搜索 8 格内紫水晶簇并采集（采摘/种植已交给园丁）
    if (handleAmethyst(entity, inv, pos)) {
        writeInv(entity, inv)
        return
    }

    // 执行计划（思考后生成的步骤）
    if (stepPlan(entity, inv, pos)) {
        writeInv(entity, inv)
        return
    }

    // 思考：为可达成目标（附魔/下界合金）生成计划（并更新/清除需求）
    if (thinkAndPlan(entity, inv, pos)) {
        writeInv(entity, inv)
        return
    }

    // 需求系统：处理材料请求（寻路/交换/失败）
    if (processDemand(entity, inv)) {
        writeInv(entity, inv)
        return
    }

    // 更新专注队列（记忆，长度 5）：剔除已完成/被堵住的任务，再按优先级补充
    let mem = getMemory(entity)
    mem = mem.filter(key => hasPosition(pos, key) && needsWork(level, inv, pos, key))
    for (let key of positionPriority) {
        if (mem.length >= 5) break
        if (hasPosition(pos, key) && needsWork(level, inv, pos, key) && mem.indexOf(key) === -1) {
            mem.push(key)
        }
    }
    setMemory(entity, mem)

    // 专注队首任务（一次只做一项）
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
    let chestInfo = ''
    if (pos.chest) {
        let cb = getContainerAt(level, pos.chest)
        if (cb) {
            let items = []
            for (let i = 0; i < cb.getContainerSize(); i++) {
                let s = cb.getItem(i)
                if (!s.isEmpty()) items.push(s.id)
            }
            chestInfo = ' 箱子: ' + (items.length ? items.join(',') : '空')
        }
    }
    setTask(entity, taskNames.idle + (assigned.length ? ' [已设:' + assigned.join(',') + ']\n' : ' [未设置任何位置]\n') + chestInfo + ' \n 背包: ' + formatInv(inv))

    writeInv(entity, inv)
}

// 拾取学徒附近掉落在地上的物品（作物、骨粉等），返回拾取数量
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

// 拾取诅咒注入器附近掉落的产物，返回拾取数量
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

// 诅咒注入器（使用注册位置；只有 1 个输入槽，产物会掉落为物品实体）
function useCursedInfuser(level, inv, pos, entity) {
    let be = getContainerAt(level, pos)
    if (!be) return
    let did = []
    // 拾取附近掉落的产物
    collectNearbyItems(level, inv, pos, did)
    // 输入槽为空时放入材料
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

// ---------- 服务器 tick 循环 ----------
let apprenticeTick = 0
let servantClock = 0 // 全局 tick 计数（用于需求冷却）
ServerEvents.tick(event => {
    servantClock++
    apprenticeTick++
    if (apprenticeTick % 20 !== 0) return
    apprenticeTick = 0

    event.server.entities.forEach(entity => {
        if (entity.type === 'kubejs:apprentice') {
            // 统一服装：强制非魔法变体（紫袍）
            try { if (entity.isMagic()) entity.setMagic(false) } catch (e) {}
            global.apprenticeAI(entity)
        } else if (entity.type === 'kubejs:gardener') {
            global.gardenerAI(entity)
        }
    })
})

// ---------- 统一服装 + 命名：生成时即强制非魔法变体并命名 ----------
EntityEvents.spawned(event => {
    if (event.entity.type !== 'kubejs:apprentice' && event.entity.type !== 'kubejs:gardener') return
    assignServantName(event.entity)
    try {
        if (event.entity.isMagic()) event.entity.setMagic(false)
    } catch (e) {}
})

// ---------- 生成时绑定主人（等价 goety 仆从刷怪蛋的 setTrueOwner） ----------
EntityEvents.spawned(event => {
    if (event.entity.type !== 'kubejs:apprentice' && event.entity.type !== 'kubejs:gardener') return
    let entity = event.entity
    if (entity.getTrueOwner()) return

    let nearest = null
    let nearestDist = 1024
    for (let player of entity.server.players) {
        let dx = player.x - entity.x
        let dy = player.y - entity.y
        let dz = player.z - entity.z
        let d = dx * dx + dy * dy + dz * dz
        if (d < nearestDist) {
            nearestDist = d
            nearest = player
        }
    }
    if (nearest) {
        entity.setTrueOwner(nearest)
        entity.setHostile(false)
    }
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
                    if (entity.type !== 'kubejs:apprentice') return
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

// ---------- 需求系统（工作类仆从间材料请求） ----------
const $ParticleTypes = Java.loadClass('net.minecraft.core.particles.ParticleTypes')
const DEMAND_COOLDOWN = 40 // 需求失败后冷却 40 tick（2 秒）再重试

// 材料类别 -> 负责提供的仆从类型（未列出的类别允许任意仆从提供）
const materialProviderMap = {
    'crop': ['kubejs:gardener'],
    'seed': ['kubejs:gardener'],
    'food': ['kubejs:gardener'],
    'mineral': ['kubejs:apprentice'],
    'goety': ['kubejs:apprentice'],
    'tool': ['kubejs:apprentice'],
    'armor': ['kubejs:apprentice']
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

function isWorkServant(e) {
    return e.type === 'kubejs:apprentice' || e.type === 'kubejs:gardener'
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
// 发起材料请求（幂等：相同目标不重复发起）；多需求并存、轮询
function requestMaterials(entity, goal, items) {
    items = (items || []).filter(x => x != null)
    if (items.length === 0) return
    let demands = getDemands(entity)
    for (let d of demands) {
        if (d.goal === goal) {
            // 已有该目标的需求：缺料清单变化时更新（保留冷却，实现临时挂起）
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
// 清理已满足的需求（目标已不再缺料），每轮 AI 开头调用
function cleanupDemands(entity, inv, pos) {
    let demands = getDemands(entity)
    if (demands.length === 0) return
    let chestInv = getChestInvMap(entity.level, pos)
    demands = demands.filter(d => {
        let goal = d.goal
        if (!goal) return false // 无目标，移除
        let missing = findMissingMaterials(inv, chestInv, goal, 1, 0, [], [], true)
        return missing.length > 0 // 仍缺料，保留
    })
    setDemands(entity, demands)
}
function spawnDemandParticles(entity, happy) {
    try {
        let p = happy ? $ParticleTypes.HAPPY_VILLAGER : $ParticleTypes.ANGRY_VILLAGER
        entity.level.spawnParticles(p, true, entity.x, entity.y + 1, entity.z, 0.4, 0.5, 0.4, 6, 0.05)
    } catch (e) {}
}
// 处理需求队列（轮询 + 临时挂起）；返回 true 表示本轮正在处理需求
function processDemand(entity, inv) {
    let demands = getDemands(entity)
    if (demands.length === 0) return false
    let level = entity.level
    let now = servantClock
    // 轮询：按 retryTick 排序，取最早可重试的需求
    demands.sort((a, b) => (a.retryTick || 0) - (b.retryTick || 0))
    let d = demands[0]
    let items = (d.items || (d.item ? [d.item] : [])).filter(x => x != null)
    if (now < (d.retryTick || 0)) return false // 全部冷却中，暂不重试
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
        tellOwner(entity, '需求 ' + items.join('/') + ' 失败：附近 16 格内无其他可提供的工作仆从（已排除 ' + (d.exclude.length - 1) + ' 个）')
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
        setTask(entity, '向 ' + servantLabel(provider) + ' 请求 ' + items.join('/') + '（前往查阅其背包与仓库）')
        return true
    }
    let pinv = readInv(provider)
    let providerPos = readPositions(provider)
    let chestInv = getChestInvMap(level, providerPos)
    // 找对方第一个持有的材料
    let given = null
    let fromInv = false
    let crafted = false
    for (let item of items) {
        if ((pinv[item] || 0) > 0) { given = item; fromInv = true; break }
        if ((chestInv[item] || 0) > 0) { given = item; fromInv = false; break }
    }
    // 多级需求：对方没有直接持有，模拟其能否合成该材料
    if (!given) {
        for (let item of items) {
            let missing = findMissingMaterials(pinv, chestInv, item, 1, 0, [], [], true)
            if (missing.length === 0) {
                let plan = planGetItem(pinv, chestInv, item, 1, 0, [], true)
                if (plan && plan.length) {
                    for (let step of plan) executeStep(provider, pinv, providerPos, step)
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
            tellOwner(entity, '从 ' + servantLabel(provider) + ' 取得 ' + given + (crafted ? '（其合成有货）' : '（其背包有货）'))
        } else {
            removeFromStorage(level, providerPos, given, 1)
            tellOwner(entity, '从 ' + servantLabel(provider) + ' 取得 ' + given + '（其仓库有货）')
        }
        addInv(inv, given, 1)
        spawnDemandParticles(entity, true)
        spawnDemandParticles(provider, true)
        demands.splice(0, 1) // 该需求已满足，移除；下一轮重新评估可连续请求
        setDemands(entity, demands)
        return false
    } else {
        spawnDemandParticles(entity, false)
        spawnDemandParticles(provider, false)
        tellOwner(entity, servantLabel(provider) + ' 无 ' + items.join('/') + '（已查阅其背包与仓库）')
        d.exclude.push(provider.id)
        d.retryTick = now + DEMAND_COOLDOWN
        setDemands(entity, demands)
        return true
    }
}

// ---------- 园丁 ----------
const gardenerIngredients = [
    { id: 'minecraft:paper', threshold: 32 },
    { id: 'minecraft:sugar', threshold: 32 },
    { id: 'quark:sugar_cane_block', threshold: 32 },
    { id: 'minecraft:glistering_melon_slice', threshold: 8 },
    { id: 'minecraft:golden_carrot', threshold: 8 },
    { id: 'minecraft:golden_apple', threshold: 8 },
    { id: 'minecraft:magma_cream', threshold: 8 },
    { id: 'minecraft:fermented_spider_eye', threshold: 8 },
    { id: 'minecraft:blaze_powder', threshold: 8 }
]
const brewRecipes = [
    { ingredient: 'minecraft:glistering_melon_slice', potion: 'minecraft:healing' },
    { ingredient: 'minecraft:golden_carrot', potion: 'minecraft:night_vision' },
    { ingredient: 'minecraft:magma_cream', potion: 'minecraft:fire_resistance' },
    { ingredient: 'minecraft:fermented_spider_eye', potion: 'minecraft:weakness' },
    { ingredient: 'minecraft:sugar', potion: 'minecraft:swiftness' },
    { ingredient: 'minecraft:ghast_tear', potion: 'minecraft:regeneration' },
    { ingredient: 'minecraft:rabbit_foot', potion: 'minecraft:leaping' }
]
function potionId(stack) {
    try {
        if (stack.nbt && stack.nbt.Potion) return String(stack.nbt.Potion)
    } catch (e) {}
    return null
}
function isWaterBottle(stack) {
    return stack.id === 'minecraft:potion' && potionId(stack) === 'minecraft:water'
}
function isAwkward(stack) {
    return stack.id === 'minecraft:potion' && potionId(stack) === 'minecraft:awkward'
}
function isFinishedPotion(stack) {
    if (stack.id !== 'minecraft:potion') return false
    let p = potionId(stack)
    return p && p !== 'minecraft:water' && p !== 'minecraft:awkward'
}

// ---------- 园丁交互 ----------
global.gardenerInteract = (ctx) => {
    const { entity, player } = ctx
    if (!player || player.level.isClientSide()) return
    let held = player.mainHandItem
    if (held.id === 'kubejs:store_list') {
        let list = listPositions(held)
        let pos = readPositions(entity)
        pos.barrels = list.map(p => [p[0], p[1], p[2]])
        writePositions(entity, pos)
        player.tell('已设置园丁 ' + list.length + ' 个木桶位置')
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
    else if (blockId === 'minecraft:brewing_stand') key = 'brewingStand'
    else if (blockId === 'minecraft:hopper') key = 'hopper'
    else if (blockId === 'minecraft:chest' || blockId === 'minecraft:trapped_chest' || blockId === 'minecraft:barrel') key = 'chest'
    else if (blockId === 'goety:raiding_chest') key = 'raiderChest'
    if (!key) { player.tell('园丁无法使用该方块'); return }
    let pos = readPositions(entity)
    pos[key] = [x, y, z]
    writePositions(entity, pos)
    player.tell('已设置园丁的 ' + key + ' 位置')
}

// 从存储容器中按谓词找物品栈
function findStackInStorage(level, pos, pred) {
    for (let be of getStorageContainers(level, pos)) {
        for (let i = 0; i < be.getContainerSize(); i++) {
            let s = be.getItem(i)
            if (!s.isEmpty() && pred(s)) return { be: be, slot: i, stack: s }
        }
    }
    return null
}

// 装水：把玻璃瓶装满成水瓶（存 NBT）
function fillWaterBottles(entity, inv, pos) {
    let level = entity.level
    if (findStackInStorage(level, pos, isWaterBottle)) return false
    if ((inv['minecraft:glass_bottle'] || 0) < 1) return false
    let water = findWaterSource(level, entity)
    if (!water) return false
    let dx = entity.x - (water[0] + 0.5), dy = entity.y - water[1], dz = entity.z - (water[2] + 0.5)
    if (dx * dx + dy * dy + dz * dz > WORK_DIST_SQ) {
        entity.navigation.moveTo(water[0] + 0.5, water[1], water[2] + 0.5, 1.0)
        setTask(entity, '前往水源装水')
        return true
    }
    let count = Math.min(inv['minecraft:glass_bottle'], 3)
    removeInv(inv, 'minecraft:glass_bottle', count)
    let containers = getStorageContainers(level, pos)
    for (let i = 0; i < count; i++) {
        let wb = Item.of('minecraft:potion', '{Potion:"minecraft:water"}')
        let placed = false
        for (let c of containers) {
            let slot = findEmptySlot(c)
            if (slot !== -1) { c.setItem(slot, wb); placed = true; break }
        }
        if (!placed) addInv(inv, 'minecraft:potion', 1)
    }
    debugItem(entity, '装 ' + count + ' 个水瓶')
    return true
}

// ---------- 酿造 ----------
function useBrewingStand(entity, inv, pos) {
    let level = entity.level
    let bp = pos.brewingStand
    let be = getContainerAt(level, bp)
    if (!be) return false
    let dx = entity.x - (bp[0] + 0.5)
    let dy = entity.y - bp[1]
    let dz = entity.z - (bp[2] + 0.5)
    if (dx * dx + dy * dy + dz * dz > WORK_DIST_SQ) {
        entity.navigation.moveTo(bp[0] + 0.5, bp[1], bp[2] + 0.5, 1.0)
        setTask(entity, '前往酿造台')
        return true
    }
    let did = []
    // 燃料
    if (be.getItem(4).isEmpty()) {
        if ((inv['minecraft:blaze_powder'] || 0) > 0) {
            removeInv(inv, 'minecraft:blaze_powder', 1)
            be.setItem(4, Item.of('minecraft:blaze_powder', 1))
            did.push('加烈焰粉')
        }
    }
    let slot0 = be.getItem(0), slot1 = be.getItem(1), slot2 = be.getItem(2)
    let allWater = !slot0.isEmpty() && isWaterBottle(slot0) && !slot1.isEmpty() && isWaterBottle(slot1) && !slot2.isEmpty() && isWaterBottle(slot2)
    let allAwkward = !slot0.isEmpty() && isAwkward(slot0) && !slot1.isEmpty() && isAwkward(slot1) && !slot2.isEmpty() && isAwkward(slot2)
    let anyFinished = isFinishedPotion(slot0) || isFinishedPotion(slot1) || isFinishedPotion(slot2)
    // 取最终药水（保留 NBT）
    if (anyFinished) {
        let st = getStorageContainers(level, pos)
        for (let i = 0; i < 3; i++) {
            let s = be.getItem(i)
            if (isFinishedPotion(s)) {
                let placed = false
                for (let c of st) {
                    let slot = findEmptySlot(c)
                    if (slot !== -1) { c.setItem(slot, s); placed = true; break }
                }
                if (placed) be.setItem(i, $ItemStack.EMPTY)
                did.push('取 ' + potionId(s))
            }
        }
        if (did.length) debugItem(entity, '酿造 ' + did.join(', '))
        return true
    }
    // 放水瓶
    if (slot0.isEmpty() || slot1.isEmpty() || slot2.isEmpty()) {
        let wb = findStackInStorage(level, pos, isWaterBottle)
        if (wb) {
            for (let i = 0; i < 3; i++) {
                if (be.getItem(i).isEmpty()) {
                    be.setItem(i, wb.stack)
                    wb.be.setItem(wb.slot, $ItemStack.EMPTY)
                    did.push('放水瓶')
                    break
                }
            }
        }
    }
    // 放材料：水→下界疣；awkward→药水材料
    if (be.getItem(3).isEmpty()) {
        if (allWater) {
            if ((inv['minecraft:nether_wart'] || 0) > 0) {
                removeInv(inv, 'minecraft:nether_wart', 1)
                be.setItem(3, Item.of('minecraft:nether_wart', 1))
                did.push('放下界疣')
            }
        } else if (allAwkward) {
            let chestInv = getChestInvMap(level, pos)
            for (let r of brewRecipes) {
                if ((inv[r.ingredient] || 0) + (chestInv[r.ingredient] || 0) > 0) {
                    if ((inv[r.ingredient] || 0) > 0) removeInv(inv, r.ingredient, 1)
                    else removeFromStorage(level, pos, r.ingredient, 1)
                    be.setItem(3, Item.of(r.ingredient, 1))
                    did.push('放 ' + r.ingredient)
                    break
                }
            }
        }
    }
    if (did.length) debugItem(entity, '酿造 ' + did.join(', '))
    return false
}

// ---------- 园丁炼药材料合成 ----------
function thinkGardenerCraft(entity, inv, pos) {
    if (!pos.workstation) return false
    let level = entity.level
    let chestInv = getChestInvMap(level, pos)
    for (let entry of gardenerIngredients) {
        let ingredient = entry.id
        let threshold = entry.threshold || 8
        if (availableCount(inv, chestInv, ingredient) >= threshold) continue
        let rs = recipesByOutput(ingredient)
        if (!rs.length) continue
        let r = rs[0]
        let enough = true
        for (let k in r.in) {
            if (availableCount(inv, chestInv, k) < r.in[k]) { enough = false; break }
        }
        if (!enough) {
            // 为每个缺料的炼药材料发起需求（多需求并存、轮询）
            let missing = findMissingMaterials(inv, chestInv, ingredient, 1, 0, [], [], true)
            if (missing.length) requestMaterials(entity, ingredient, missing)
            continue
        }
        let plan = []
        for (let k in r.in) {
            let sub = planGetItem(inv, chestInv, k, r.in[k], 0, [])
            if (!sub) { enough = false; break }
            plan = plan.concat(sub)
        }
        if (!enough) continue
        plan.push({ a: 'craft', recipe: r.id })
        setPlan(entity, plan)
        setTask(entity, '思考 ' + plan.map(describeStep).join(' → '))
        return true
    }
    return false
}

// ---------- 园丁主 AI ----------
global.gardenerAI = (entity) => {
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

    // 农田（种植盆 + 砰砰疣 + 下界疣）
    if (handleFarming(entity, inv, pos)) { writeInv(entity, inv); return }
    if (handlePlanterFarming(entity, inv, pos)) { writeInv(entity, inv); return }
    // 甘蔗（高度>2，只割上部）
    if (handleSugarcane(entity, inv, pos)) { writeInv(entity, inv); return }
    // 西瓜/南瓜（优先精准采集斧头）
    if (handleGourd(entity, inv, pos)) { writeInv(entity, inv); return }

    // 装水（水瓶）
    if (pos.brewingStand && fillWaterBottles(entity, inv, pos)) { writeInv(entity, inv); return }

    // 酿造
    if (pos.brewingStand && useBrewingStand(entity, inv, pos)) { writeInv(entity, inv); return }

    // 执行计划
    if (stepPlan(entity, inv, pos)) { writeInv(entity, inv); return }

    // 思考炼药材料（并更新/清除需求）
    if (thinkGardenerCraft(entity, inv, pos)) { writeInv(entity, inv); return }

    // 需求系统：处理材料请求
    if (processDemand(entity, inv)) { writeInv(entity, inv); return }

    // 专注队列：存储
    let mem = getMemory(entity)
    mem = mem.filter(key => hasPosition(pos, key) && needsWork(level, inv, pos, key))
    for (let key of positionPriority) {
        if (mem.length >= 5) break
        if (hasPosition(pos, key) && needsWork(level, inv, pos, key) && mem.indexOf(key) === -1) mem.push(key)
    }
    setMemory(entity, mem)
    let focus = mem[0]
    if (focus) {
        let p = focus === 'barrels' ? firstStoragePos(pos) : pos[focus]
        if (!p) { mem.shift(); setMemory(entity, mem); writeInv(entity, inv); return }
        let dx = entity.x - (p[0] + 0.5), dy = entity.y - p[1], dz = entity.z - (p[2] + 0.5)
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
    setTask(entity, taskNames.idle)
    writeInv(entity, inv)
}

// ---------- 命令：查看附近工作类仆从需求 ----------
ServerEvents.commandRegistry(event => {
    const { commands } = event
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
                                found.push(servantLabel(e) + ': 请求 ' + items.join('/'))
                            }
                        }
                        if (found.length === 0) {
                            ctx.source.sendSuccess(Text.of('附近没有工作类仆从的需求'), false)
                        } else {
                            for (let line of found) {
                                ctx.source.sendSuccess(Text.of('§6[需求] §r' + line), false)
                            }
                        }
                        return 1
                    })))
    )
})

// ---------- 敲击 desk_bell：强制周围仆从重跑一次需求检测 ----------
BlockEvents.rightClicked(event => {
    if (event.block.id !== 'create:desk_bell') return
    let player = event.player
    if (!player || player.level.isClientSide()) return
    let level = player.level
    let aabb = new $AABB(event.block.x - 32, event.block.y - 32, event.block.z - 32, event.block.x + 32, event.block.y + 32, event.block.z + 32)
    let count = 0
    for (let e of level.getEntitiesWithin(aabb)) {
        if (!isWorkServant(e)) continue
        // 清除旧需求（含冷却），下一轮 thinkAndPlan 会立即重新 findMissingMaterials + 发起新需求
        clearDemand(e)
        count++
    }
    if (count > 0) player.tell('§e已强制 ' + count + ' 个工作仆从重新检测需求')
})