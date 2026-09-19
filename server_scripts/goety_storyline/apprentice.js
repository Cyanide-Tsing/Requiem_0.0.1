const $WaystoneItem = Java.loadClass('com.Polarice3.Goety.common.items.WaystoneItem')
const $EnchantmentHelper = Java.loadClass('net.minecraft.world.item.enchantment.EnchantmentHelper')
const $ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')

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
// in: 消耗, out: 产出, at: 'workstation'（需工作台）。打磨单独处理（砂纸耐久 8）
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
    list.push({ id: 'sandpaper', in: { 'minecraft:paper': 1, 'minecraft:sand': 1 }, out: { 'create:sand_paper': 1 }, at: 'workstation', name: '合成砂纸' })
    list.push({ id: 'snap_seed', in: { 'goety:snap_fungus': 1 }, out: { 'goety:snap_warts': 4 }, at: 'workstation', name: '合成砰砰菌种子' })
    list.push({ id: 'netherite', in: { 'minecraft:netherite_scrap': 4, 'minecraft:gold_ingot': 4 }, out: { 'minecraft:netherite_ingot': 1 }, at: 'workstation', name: '合成下界合金' })
    return list
})()

// 可烧炼的矿物（矿石/粗金属）
const smeltables = [
    'minecraft:iron_ore', 'minecraft:deepslate_iron_ore', 'minecraft:raw_iron',
    'minecraft:gold_ore', 'minecraft:deepslate_gold_ore', 'minecraft:raw_gold',
    'minecraft:copper_ore', 'minecraft:deepslate_copper_ore', 'minecraft:raw_copper',
    'minecraft:ancient_debris', 'minecraft:nether_gold_ore'
]

// 燃料
const fuels = ['minecraft:coal', 'minecraft:charcoal', 'minecraft:coal_block']

// 诅咒注入器输入（简化清单，实际可用 tag 匹配更多）
const cursedInfuserInputs = [
    'minecraft:iron_ingot', 'minecraft:emerald', 'minecraft:obsidian',
    'minecraft:amethyst_shard'
]

// 农田作物（8 格内自动收割 + 补种）
const FARM_RANGE = 8
const farmCrops = {
    'minecraft:nether_wart': { maxAge: 3, seed: 'minecraft:nether_wart', harvest: 'minecraft:nether_wart', keepHarvest: false },
    'goety:snap_warts': { maxAge: 2, seed: 'goety:snap_warts', harvest: 'goety:snap_fungus', keepHarvest: true }
}


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

// 学徒“会用到/保留”的物品（其余才会存进箱子）
function isWorkItem(id) {
    return !!(polishMap[id] || mineralBlocks[id] ||
        smeltables.indexOf(id) !== -1 || fuels.indexOf(id) !== -1 ||
        cursedInfuserInputs.indexOf(id) !== -1 || isEnchantable(id) ||
        id === 'minecraft:paper' || id === 'minecraft:sand' ||
        id === 'create:sand_paper' || id === 'minecraft:lapis_lazuli' ||
        id === 'goety:snap_warts' || id === 'goety:snap_fungus')
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

// ---------- 指路石交互 ----------
global.apprenticeInteract = (ctx) => {
    const { entity, player } = ctx
    if (!player || player.level.isClientSide()) return
    let held = player.mainHandItem
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
    else if (blockId === 'goety:raiding_chest') key = 'raiderChest'
    else if (blockId === 'minecraft:chest' || blockId === 'minecraft:trapped_chest' || blockId === 'minecraft:barrel') key = 'chest'

    if (!key) {
        player.tell('学徒无法使用该方块')
        return
    }
    let pos = readPositions(entity)
    pos[key] = [x, y, z]
    writePositions(entity, pos)
    player.tell('已设置学徒的 ' + key + ' 位置')
}

// ---------- 行为：袭击者箱子存取 ----------
function useRaiderChest(level, inv, pos, entity) {
    let be = getContainerAt(level, pos)
    if (!be) return
    let did = []
    // 把库存里非工作物品存入箱子
    for (let id in inv) {
        if (isWorkItem(id)) continue
        let slot = findEmptySlot(be)
        if (slot === -1) break
        be.setItem(slot, Item.of(id, inv[id]))
        did.push('存 ' + inv[id] + 'x' + id)
        delete inv[id]
    }
    // 从箱子取出所有工作物品（矿石 / rough gem / 燃料 / 锭 / 纸 / 沙 / 青金石等）；已附魔的跳过
    for (let i = 0; i < be.getContainerSize(); i++) {
        let stack = be.getItem(i)
        if (!stack.isEmpty() && isWorkItem(stack.id) && !stack.isEnchanted()) {
            addInv(inv, stack.id, stack.count)
            be.setItem(i, $ItemStack.EMPTY)
            did.push('取 ' + stack.count + 'x' + stack.id)
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
function getStorageChest(level, pos) {
    for (let key of ['chest', 'raiderChest']) {
        if (pos[key]) {
            let be = getContainerAt(level, pos[key])
            if (be) return be
        }
    }
    return null
}

// 定期把背包里非工作物品存入注册箱子（背景工序）
function depositNonWorkItems(entity, inv, pos) {
    let chest = getStorageChest(entity.level, pos)
    if (!chest) return
    let did = []
    for (let id in inv) {
        if (isWorkItem(id)) continue
        let slot = findEmptySlot(chest)
        if (slot === -1) break
        chest.setItem(slot, Item.of(id, inv[id]))
        did.push(inv[id] + 'x' + id)
        delete inv[id]
    }
    if (did.length) debugItem(entity, '存 ' + did.join(', '))
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

// ---------- 行为：熔炉 ----------
function useFurnace(level, inv, pos, entity) {
    let be = getContainerAt(level, pos)
    if (!be) return
    let did = []
    // 取输出（攒够一批才取）
    let output = be.getItem(2)
    if (output.count >= FURNACE_OUTPUT_THRESHOLD) {
        addInv(inv, output.id, output.count)
        be.setItem(2, $ItemStack.EMPTY)
        did.push('取 ' + output.count + 'x' + output.id)
    }
    // 补燃料（一整叠）
    let fuel = be.getItem(1)
    if (fuel.isEmpty()) {
        let fid = findInv(inv, fuels)
        if (fid) {
            let count = Math.min(inv[fid], 64)
            removeInv(inv, fid, count)
            be.setItem(1, Item.of(fid, count))
            did.push('加燃料 ' + count + 'x' + fid)
        }
    }
    // 放入可烧炼矿物（一整叠）
    let input = be.getItem(0)
    if (input.isEmpty()) {
        let mid = findInv(inv, smeltables)
        if (mid) {
            let count = Math.min(inv[mid], 64)
            removeInv(inv, mid, count)
            be.setItem(0, Item.of(mid, count))
            did.push('放矿 ' + count + 'x' + mid)
        }
    } else if (inv[input.id]) {
        // 熔炉里已有同类，继续补满
        let add = Math.min(inv[input.id], 64 - input.count)
        if (add > 0) {
            removeInv(inv, input.id, add)
            be.setItem(0, Item.of(input.id, input.count + add))
            did.push('补矿 ' + add + 'x' + input.id)
        }
    }
    if (did.length) debugItem(entity, '熔炉 ' + did.join(', '))
}

// ---------- 行为：工作台合成 ----------
function useWorkstation(inv, entity) {
    let did = []
    // 9 锭 -> 块（批量，只压缩，避免与反向合成互相振荡）
    for (let ingot in mineralBlocks) {
        let count = Math.floor((inv[ingot] || 0) / 9)
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
        // 只对可附魔物品（工具/装备/书）
        if (!isEnchantable(id)) continue
        removeInv(inv, id, 1)
        removeInv(inv, 'minecraft:lapis_lazuli', 3)
        let enchanted = $EnchantmentHelper.enchantItem(level.random, stack, 30, false)
        // 附魔完的物品放进注册箱子（保留附魔 NBT）
        let chest = getStorageChest(level, pos)
        if (chest) {
            let slot = findEmptySlot(chest)
            if (slot !== -1) {
                chest.setItem(slot, enchanted)
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
    let amethystTarget = null
    for (let dy = -FARM_RANGE; dy <= FARM_RANGE; dy++)
        for (let dz = -FARM_RANGE; dz <= FARM_RANGE; dz++)
            for (let dx = -FARM_RANGE; dx <= FARM_RANGE; dx++) {
                let x = bx + dx, y = by + dy, z = bz + dz
                let bc = level.getBlock(x, y, z)
                if (!bc) continue
                let id = bc.id
                let crop = farmCrops[id]
                if (crop) {
                    // snap_warts 需要种子才能补种，无种子则跳过
                    if (crop.seed !== crop.harvest && (inv[crop.seed] || 0) < 1) continue
                    if (getCropAge(bc) >= crop.maxAge) {
                        return { type: 'crop', id: id, x: x, y: y, z: z, bc: bc }
                    }
                } else if (id === 'minecraft:amethyst_cluster' && !amethystTarget) {
                    amethystTarget = { type: 'amethyst', x: x, y: y, z: z, bc: bc }
                }
            }
    return amethystTarget
}

function storeHarvest(level, pos, inv, id, count) {
    let chest = getStorageChest(level, pos)
    if (chest) {
        let slot = findEmptySlot(chest)
        if (slot !== -1) {
            chest.setItem(slot, Item.of(id, count))
            return
        }
    }
    addInv(inv, id, count)
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
    let bc = target.bc
    let drops = bc.getDrops() || []
    bc.set('minecraft:air')
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
        setTask(entity, '前往 ' + (target.type === 'crop' ? '收割作物' : '采集紫水晶'))
        return true
    }
    if (target.type === 'crop') harvestCrop(level, inv, target, entity, pos)
    else harvestAmethyst(level, inv, target, entity, pos)
    setTask(entity, target.type === 'crop' ? '收割作物' : '采集紫水晶')
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
    let chest = getStorageChest(level, pos)
    let map = {}
    if (chest) {
        for (let i = 0; i < chest.getContainerSize(); i++) {
            let s = chest.getItem(i)
            if (!s.isEmpty() && !s.isEnchanted()) map[s.id] = (map[s.id] || 0) + s.count
        }
    }
    return map
}

// 反向规划：获得 item 数量 count（返回步骤数组或 null）
function planGetItem(inv, chestInv, item, count, depth, visited) {
    if (depth > 8) return null
    if ((inv[item] || 0) >= count) return []
    if (visited.indexOf(item) !== -1) return null
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
    // 通过配方
    for (let r of recipesByOutput(item)) {
        let ni = cloneInv(inv), nc = cloneInv(chestInv)
        let nv = visited.concat(item)
        let subPlans = []
        let ok = true
        for (let inItem in r.in) {
            let sub = planGetItem(ni, nc, inItem, r.in[inItem], depth + 1, nv)
            if (!sub) { ok = false; break }
            applyPlan(ni, nc, sub)
            subPlans.push(sub)
        }
        if (!ok) continue
        let plan = []
        for (let s of subPlans) plan = plan.concat(s)
        plan.push({ a: 'craft', recipe: r.id })
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

function findEnchantableItem(inv, chestInv) {
    for (let id in inv) if (inv[id] > 0 && isEnchantable(id)) return id
    for (let id in chestInv) if (chestInv[id] > 0 && isEnchantable(id)) return id
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
    if (step.a === 'polish') return '打磨 ' + step.rough
    if (step.a === 'enchant') return '附魔'
    return step.a
}

function executeStep(entity, inv, pos, step) {
    let level = entity.level
    if (step.a === 'take') {
        let chest = getStorageChest(level, pos)
        if (!chest) return
        let need = step.count
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
        if (need < step.count) debugItem(entity, '取 ' + (step.count - need) + 'x ' + step.item)
    } else if (step.a === 'craft') {
        let r = recipeById(step.recipe)
        if (!r) return
        let times = step.count || 1
        let enough = true
        for (let k in r.in) if ((inv[k] || 0) < r.in[k] * times) { enough = false; break }
        if (enough) {
            for (let k in r.in) removeInv(inv, k, r.in[k] * times)
            for (let k in r.out) addInv(inv, k, r.out[k] * times)
            debugItem(entity, r.name + (times > 1 ? ' x' + times : ''))
        }
    } else if (step.a === 'polish') {
        polishGems(inv, entity)
        debugItem(entity, '打磨 ' + step.rough)
    } else if (step.a === 'enchant') {
        enchant(level, inv, entity, pos)
    }
}

// 执行计划中的下一步（返回 true 表示正在执行计划）
function stepPlan(entity, inv, pos) {
    let plan = getPlan(entity)
    if (!plan || plan.length === 0) return false
    let step = plan[0]
    let level = entity.level
    let targetPos = null
    let navTask = ''
    if (step.a === 'take') {
        targetPos = pos.chest || pos.raiderChest
        navTask = '前往箱子'
    } else if (step.a === 'craft') {
        let r = recipeById(step.recipe)
        if (r && r.at === 'workstation') {
            targetPos = pos.workstation
            navTask = '前往工作台'
        }
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
    executeStep(entity, inv, pos, step)
    plan.shift()
    setPlan(entity, plan)
    setTask(entity, '执行 ' + describeStep(step))
    return true
}

// 思考：为可达成目标生成计划
function thinkAndPlan(entity, inv, pos) {
    let level = entity.level
    let chestInv = getChestInvMap(level, pos)
    if (pos.enchantingTable) {
        let plan = planEnchant(inv, chestInv)
        if (plan && plan.length) {
            setPlan(entity, plan)
            setTask(entity, '思考 ' + plan.map(describeStep).join(' → '))
            return true
        }
    }
    if (pos.workstation) {
        let plan = planNetherite(inv, chestInv)
        if (plan && plan.length) {
            setPlan(entity, plan)
            setTask(entity, '思考 ' + plan.map(describeStep).join(' → '))
            return true
        }
    }
    return false
}

// ---------- 寻路 ----------
const positionPriority = ['hopper', 'chest', 'raiderChest', 'furnace', 'workstation']
const WORK_DIST_SQ = 6.25 // 约 2.5 格内视为到达
const FURNACE_OUTPUT_THRESHOLD = 16 // 熔炉产物攒够 16 个才取一次

function needsWork(level, inv, pos, key) {
    let p = pos[key]
    if (!p) return false
    // 工作台/附魔台不是容器方块实体，无需容器判定
    if (key === 'workstation') {
        for (let ingot in mineralBlocks) if ((inv[ingot] || 0) >= 9) return true
        if ((inv['goety:snap_fungus'] || 0) >= 1) return true
        return (inv['minecraft:paper'] || 0) >= 1 && (inv['minecraft:sand'] || 0) >= 1
    }
    if (key === 'enchantingTable') return false // 附魔改由规划系统处理
    let be = getContainerAt(level, p)
    if (!be) return false
    switch (key) {
        case 'hopper':
            for (let i = 0; i < be.getContainerSize(); i++) {
                let s = be.getItem(i)
                if (!s.isEmpty() && !s.isEnchanted()) return true
            }
            return false
        case 'raiderChest':
        case 'chest':
            // 箱子有空位才需要存非工作物品，避免箱子满后死循环
            let hasEmptySlot = false
            for (let i = 0; i < be.getContainerSize(); i++) {
                if (be.getItem(i).isEmpty()) { hasEmptySlot = true; break }
            }
            if (hasEmptySlot) {
                for (let id in inv) if (!isWorkItem(id)) return true
            }
            // 只取未附魔的工作物品（与 useRaiderChest 取物过滤保持一致，避免死循环）
            for (let i = 0; i < be.getContainerSize(); i++) {
                let s = be.getItem(i)
                if (!s.isEmpty() && isWorkItem(s.id) && !s.isEnchanted()) return true
            }
            return false
        case 'furnace':
            // 产物攒够一批才取，避免每烧完一个锭就跑一趟
            if (be.getItem(2).count >= FURNACE_OUTPUT_THRESHOLD) return true
            if (be.getItem(1).isEmpty() && findInv(inv, fuels)) return true
            let furnaceInput = be.getItem(0)
            if (furnaceInput.isEmpty()) return findInv(inv, smeltables) !== null
            return furnaceInput.count < 64 && !!inv[furnaceInput.id]
    }
    return false
}

function doWork(entity, inv, pos, key) {
    let level = entity.level
    switch (key) {
        case 'hopper': useHopper(level, inv, pos[key], entity); break
        case 'raiderChest':
        case 'chest': useRaiderChest(level, inv, pos[key], entity); break
        case 'furnace': useFurnace(level, inv, pos[key], entity); break
        case 'workstation': useWorkstation(inv, entity); break
        case 'enchantingTable': enchant(level, inv, entity, pos); break
    }
}

// ---------- 调试：报告当前任务给主人 ----------
const taskNames = {
    'hopper': '从漏斗取物',
    'chest': '箱子存取',
    'raiderChest': '袭击者箱子存取',
    'furnace': '熔炉烧炼',
    'workstation': '工作台合成',
    'enchantingTable': '附魔',
    'polish': '打磨宝石',
    'cursedInfuser': '使用诅咒注入器',
    'idle': '空闲',
    'follow': '跟随主人'
}

function tellOwner(entity, task) {
    let owner = entity.getTrueOwner()
    if (owner && owner.isPlayer()) {
        owner.tell(Text.of('§7[学徒] ' + task))
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
        owner.tell(Text.of('§b[学徒操作] ' + msg))
    }
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

    // 农田：搜索 8 格内成熟作物/紫水晶簇并处理（优先于专注队列）
    if (handleFarming(entity, inv, pos)) {
        writeInv(entity, inv)
        return
    }

    // 执行计划（思考后生成的步骤）
    if (stepPlan(entity, inv, pos)) {
        writeInv(entity, inv)
        return
    }

    // 思考：为可达成目标（附魔/下界合金）生成计划
    if (thinkAndPlan(entity, inv, pos)) {
        writeInv(entity, inv)
        return
    }

    // 更新专注队列（记忆，长度 5）：剔除已完成/被堵住的任务，再按优先级补充
    let mem = getMemory(entity)
    mem = mem.filter(key => pos[key] && needsWork(level, inv, pos, key))
    for (let key of positionPriority) {
        if (mem.length >= 5) break
        if (pos[key] && needsWork(level, inv, pos, key) && mem.indexOf(key) === -1) {
            mem.push(key)
        }
    }
    setMemory(entity, mem)

    // 专注队首任务（一次只做一项）
    let focus = mem[0]
    if (focus) {
        let p = pos[focus]
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

    useCursedInfuserNearby(entity, inv)
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

// 诅咒注入器（按实体坐标附近搜索）
function useCursedInfuserNearby(entity, inv) {
    /*let level = entity.level
    for (let dx = -8; dx <= 8; dx++) {
        for (let dy = -8; dy <= 8; dy++) {
            for (let dz = -8; dz <= 8; dz++) {
                let be = level.getBlockEntity(new BlockPos(entity.x + dx, entity.y + dy, entity.z + dz))
                if (!be) continue
                let blockId = level.getBlock(entity.x + dx, entity.y + dy, entity.z + dz).id
                if (blockId !== 'goety:cursed_infuser') continue
                drainContainerSlot(level, inv, [entity.x + dx, entity.y + dy, entity.z + dz], 1)
                let input = be.getItem(0)
                if (input.isEmpty()) {
                    let mid = findInv(inv, cursedInfuserInputs)
                    if (mid) {
                        removeInv(inv, mid, 1)
                        be.setItem(0, Item.of(mid))
                    }
                }
                return
            }
        }
    }*/
   return; //别动！ bug
}

// ---------- 服务器 tick 循环 ----------
let apprenticeTick = 0
ServerEvents.tick(event => {
    apprenticeTick++
    if (apprenticeTick % 20 !== 0) return
    apprenticeTick = 0

    event.server.entities.forEach(entity => {
        if (entity.type !== 'kubejs:apprentice') return
        global.apprenticeAI(entity)
    })
})

// ---------- 生成时绑定主人（等价 goety 仆从刷怪蛋的 setTrueOwner） ----------
EntityEvents.spawned(event => {
    if (event.entity.type !== 'kubejs:apprentice') return
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
