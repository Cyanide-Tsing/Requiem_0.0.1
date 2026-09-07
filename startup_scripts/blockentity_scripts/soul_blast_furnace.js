const $ISoulCandle = Java.loadClass('com.Polarice3.Goety.api.blocks.entities.ISoulCandle')
const $RegistryAccess = Java.loadClass('net.minecraft.core.RegistryAccess')

// 灵魂高炉配方表：输入物品 id -> { output, soulCost }
// 由 server_scripts 在配方加载后调用 addCreateHauntingRecipe / addCursedInfuserRecipe 构建，
// 客户端（jei.js）使用同一批函数生成 JEI 配方。
global.soulBlastRecipes = {}

global.addCreateHauntingRecipe = (map, recipe) => {
    let results = recipe.getRollableResults()
    let outputs = []
    for (let i = 0; i < results.size(); i++) {
        let out = results.get(i)
        if (out.getChance() < 1.0) return
        outputs.push(out.getStack())
    }
    if (outputs.length === 0) return

    let duration = recipe.getProcessingDuration()
    let soulCost = duration > 0 ? Math.max(1, Math.round(duration / 20)) : 15
    let ingredients = recipe.getIngredients()
    for (let i = 0; i < ingredients.size(); i++) {
        let items = ingredients.get(i).getItems()
        for (let j = 0; j < items.length; j++) {
            let stack = items[j]
            if (!stack.isEmpty()) {
                map[stack.id] = { output: outputs[0].id, soulCost: soulCost }
            }
        }
    }
}

global.addCursedInfuserRecipe = (map, recipe) => {
    let output = recipe.getResultItem($RegistryAccess.EMPTY)
    if (output.isEmpty()) return

    let soulCost = Math.max(1, Math.round(recipe.getCookingTime() / 20))
    let ingredients = recipe.getIngredients()
    for (let i = 0; i < ingredients.size(); i++) {
        let items = ingredients.get(i).getItems()
        for (let j = 0; j < items.length; j++) {
            let stack = items[j]
            if (!stack.isEmpty()) {
                map[stack.id] = { output: output.id, soulCost: soulCost }
            }
        }
    }
}

function findSoulCandles(entity) {
    let candles = []
    let level = entity.level
    for (let dx = -8; dx <= 8; dx++) {
        for (let dy = -8; dy <= 8; dy++) {
            for (let dz = -8; dz <= 8; dz++) {
                let be = level.getBlockEntity(new BlockPos(entity.x + dx, entity.y + dy, entity.z + dz))
                if (be instanceof $ISoulCandle && be.getSouls() > 0) {
                    candles.push(be)
                }
            }
        }
    }
    return candles
}

global.doSoulBlasting = (entity) => {
    let recipes = global.soulBlastRecipes || {}
    let input = entity.inventory.getItem(0)
    if (input.isEmpty()) {
        entity.data.putInt('progress', 0)
        return
    }
    let recipe = recipes[input.id]
    if (!recipe) {
        entity.data.putInt('progress', 0)
        return
    }
    let output = entity.inventory.getItem(1)
    if (!output.isEmpty() && (output.id !== recipe.output || output.count >= output.maxStackSize)) {
        return
    }

    let progress = entity.data.getInt('progress')
    let need = recipe.soulCost - progress
    let furnacePos = new BlockPos(entity.x, entity.y, entity.z)
    let drained = 0

    for (let candle of findSoulCandles(entity)) {
        if (drained >= need) break
        let before = candle.getSouls()
        candle.drainSouls(1, furnacePos)
        if (candle.getSouls() < before) drained++
    }

    progress += drained
    if (progress >= recipe.soulCost) {
        entity.data.putInt('progress', 0)
        entity.inventory.removeItem(0, 1)
        if (output.isEmpty()) {
            entity.inventory.setItem(1, Item.of(recipe.output))
        } else {
            entity.inventory.setItem(1, Item.of(recipe.output, output.count + 1))
        }
    } else if (drained > 0) {
        entity.data.putInt('progress', progress)
    }
}

global.runningSoulParticles = (entity) => {
    if (Math.random() < 0.06) {
        entity.level.addParticle('minecraft:soul', true, entity.x + 0.5, entity.y + 1.1, entity.z + 0.5, (Math.random() - 0.5) * 0.03, 0.06, (Math.random() - 0.5) * 0.03)
    }
}
