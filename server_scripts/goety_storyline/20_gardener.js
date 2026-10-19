(function () {
// ============================================================
//  园丁：农田收割 + 酿造炼药
// ============================================================

const $WaystoneItem = Java.loadClass('com.Polarice3.Goety.common.items.WaystoneItem')
const $ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')

const { readPositions, writePositions, getContainerAt, listPositions,
    getStorageContainers, findEmptySlot, getChestInvMap, firstStoragePos, removeFromStorage,
    readInv, writeInv, addInv, removeInv,
    setTask, debugItem, setHeldItem,
    collectGroundItems, cleanupDemands, processDemand,
    taskNames, WORK_DIST_SQ,
    getMemory, setMemory, hasPosition, needsWork, positionPriority, doWork,
    polishGems, depositSurplus, handleFarming, handlePlanterFarming, handleSugarcane, handleGourd,
    stepPlan, findWaterSource,
    availableCount, recipesByOutput, planGetItem, findMissingMaterials, setPlan, describeStep,
    requestMaterials
} = global

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

    if (handleFarming(entity, inv, pos)) { setHeldItem(entity, 'minecraft:iron_hoe'); writeInv(entity, inv); return }
    if (handlePlanterFarming(entity, inv, pos)) { setHeldItem(entity, 'minecraft:iron_hoe'); writeInv(entity, inv); return }
    if (handleSugarcane(entity, inv, pos)) { setHeldItem(entity, 'minecraft:iron_hoe'); writeInv(entity, inv); return }
    if (handleGourd(entity, inv, pos)) { setHeldItem(entity, 'minecraft:iron_axe'); writeInv(entity, inv); return }

    if (pos.brewingStand && fillWaterBottles(entity, inv, pos)) { writeInv(entity, inv); return }
    if (pos.brewingStand && useBrewingStand(entity, inv, pos)) { writeInv(entity, inv); return }

    if (stepPlan(entity, inv, pos)) { writeInv(entity, inv); return }
    if (thinkGardenerCraft(entity, inv, pos)) { writeInv(entity, inv); return }
    if (processDemand(entity, inv)) { writeInv(entity, inv); return }

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
})();
