var $AllGuiTextures = Java.loadClass('com.simibubi.create.foundation.gui.AllGuiTextures')
var $AnimatedKinetics = Java.loadClass('com.simibubi.create.compat.jei.category.animations.AnimatedKinetics')
var $AllPartialModels = Java.loadClass('com.simibubi.create.AllPartialModels')
var $CreateRecipeCategory = Java.loadClass('com.simibubi.create.compat.jei.category.CreateRecipeCategory')
var $Axis = Java.loadClass('com.mojang.math.Axis')
var $DoubleItemIcon = Java.loadClass('com.simibubi.create.compat.jei.DoubleItemIcon')
var $RecipeIngredientRole = Java.loadClass('mezz.jei.api.recipe.RecipeIngredientRole')
var $Integer = Java.loadClass('java.lang.Integer')
var $Minecraft = Java.loadClass('net.minecraft.client.Minecraft')
var $ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')

//Adding Recipes:
//Hydrothermal
//decay
//distillation
//cyclotron

JEIAddedEvents.registerCategories(event => {
 
    const { data } = event
    const { jeiHelpers } = data
    const { guiHelper } = jeiHelpers
 
    event.custom('requiem:cyclotron', category => {
        category.title('埃尔法粒子轰击')
        category.setWidth(178)
        category.setHeight(32)
        category.background(guiHelper.createBlankDrawable(0, 0))
 
        category.iconSupplier(() => {
            return new $DoubleItemIcon(
                () => Item.of('kubejs:demon_core'),
                () => Item.of('kubejs:atomic_catalyst')
            )
        })
 
        category.handleLookup((layoutBuilder, recipe, focuses) => {
            layoutBuilder.addSlot($RecipeIngredientRole.INPUT, 21, 8)
                .setBackground($CreateRecipeCategory.getRenderedSlot(), -1, -1)
                .addItemStack(recipe.recipeData.input)
 
            layoutBuilder.addSlot($RecipeIngredientRole.OUTPUT, 141, 8)
                .setBackground($CreateRecipeCategory.getRenderedSlot(), -1, -1)
                .addItemStack(recipe.recipeData.output)
        })
 
        category.setDrawHandler((recipe, recipeSlotsView, graphics, mouseX, mouseY) => {

            $AllGuiTextures.JEI_LONG_ARROW.render(graphics, 54, 11)
            graphics.drawWordWrap(Client.font, Text.of("§7v > " + recipe.data.speed + "§r"), 71, 4, 120, 0);

            let matrixStack = graphics.pose()
            matrixStack.pushPose()
            matrixStack.popPose()
        })
    })

    event.custom('requiem:decay', category => {
        category.title('衰变')
        category.setWidth(178)
        category.setHeight(32)
        category.background(guiHelper.createBlankDrawable(0, 0))
 
        category.iconSupplier(() => {
            return new $DoubleItemIcon(
                () => Item.of('kubejs:demon_core'),
                () => Item.of('alexscaves:uranium_rod')
            )
        })
 
        category.handleLookup((layoutBuilder, recipe, focuses) => {
            layoutBuilder.addSlot($RecipeIngredientRole.INPUT, 21, 8)
                .setBackground($CreateRecipeCategory.getRenderedSlot(), -1, -1)
                .addItemStack(recipe.recipeData.input)
 
            layoutBuilder.addSlot($RecipeIngredientRole.OUTPUT, 141, 8)
                .setBackground($CreateRecipeCategory.getRenderedSlot(), -1, -1)
                .addItemStack(recipe.recipeData.product)
        })
 
        category.setDrawHandler((recipe, recipeSlotsView, graphics, mouseX, mouseY) => {
 
            $AllGuiTextures.JEI_LONG_ARROW.render(graphics, 54, 11)
            graphics.drawWordWrap(Client.font, Text.of("§7 1 / " + recipe.data.duration + "§r"), 66, 4, 120, 0);
 
            let matrixStack = graphics.pose()
            matrixStack.pushPose()
            matrixStack.popPose()
        })
    })

    event.custom('requiem:hydrothermal_reactor', category => {
        category.title('水热反应堆')
        category.setWidth(178)
        category.setHeight(32)
        category.background(guiHelper.createBlankDrawable(0, 0))
 
        category.iconSupplier(() => {
            return new $DoubleItemIcon(
                () => Item.of('kubejs:demon_core'),
                () => Item.of('minecraft:water_bucket')
            )
        })
 
        category.handleLookup((layoutBuilder, recipe, focuses) => {
            layoutBuilder.addSlot($RecipeIngredientRole.INPUT, 21, 8)
                .setBackground($CreateRecipeCategory.getRenderedSlot(), -1, -1)
                .addItemStack(recipe.recipeData.input)
 
            layoutBuilder.addSlot($RecipeIngredientRole.OUTPUT, 141, 8)
                .setBackground($CreateRecipeCategory.getRenderedSlot(), -1, -1)
                .addItemStack(recipe.recipeData.output)
        })
 
        category.setDrawHandler((recipe, recipeSlotsView, graphics, mouseX, mouseY) => {
 
            $AllGuiTextures.JEI_LONG_ARROW.render(graphics, 54, 11)
            graphics.drawWordWrap(Client.font, Text.of("§7" + recipe.data.minFuel + " / 6§r"), 71, 4, 120, 0);
 
            let matrixStack = graphics.pose()
            matrixStack.pushPose()
            matrixStack.popPose()
        })
    })

    event.custom('requiem:soul_blast_furnace', category => {
        category.title('铸魂炉')
        category.setWidth(178)
        category.setHeight(32)
        category.background(guiHelper.createBlankDrawable(0, 0))
 
        category.iconSupplier(() => {
            return new $DoubleItemIcon(
                () => Item.of('kubejs:soul_blast_furnace'),
                () => Item.of('goety:soul_candlestick')
            )
        })
 
        category.handleLookup((layoutBuilder, recipe, focuses) => {
            layoutBuilder.addSlot($RecipeIngredientRole.INPUT, 21, 8)
                .setBackground($CreateRecipeCategory.getRenderedSlot(), -1, -1)
                .addItemStack(recipe.recipeData.input)
 
            layoutBuilder.addSlot($RecipeIngredientRole.OUTPUT, 141, 8)
                .setBackground($CreateRecipeCategory.getRenderedSlot(), -1, -1)
                .addItemStack(recipe.recipeData.output)
        })
 
        category.setDrawHandler((recipe, recipeSlotsView, graphics, mouseX, mouseY) => {
 
            $AllGuiTextures.JEI_LONG_ARROW.render(graphics, 54, 11)
            graphics.drawCenteredString($Minecraft.getInstance().font, String(recipe.data.soulCost) + " 灵魂", 66, 2, 0xFFFFFF)
 
            let matrixStack = graphics.pose()
            matrixStack.pushPose()
            matrixStack.popPose()
        })
    })
})

JEIAddedEvents.registerRecipes(event => {
 
    let cyclotronTypeId = new ResourceLocation('requiem', 'cyclotron')
    let decayTypeId = new ResourceLocation('requiem', 'decay')
    let hydroThermalTypeId = new ResourceLocation('requiem', 'hydrothermal_reactor')
    cyclotronRecipes.forEach(recipe=>{
        event.custom(cyclotronTypeId).add(recipe)
    })
    decayRecipes.forEach(recipe=>{
        event.custom(decayTypeId).add(recipe)
    })
    hydrothermalRecipes.forEach(recipe=>{
        event.custom(hydroThermalTypeId).add(recipe)
    })

    let soulBlastTypeId = new ResourceLocation('requiem', 'soul_blast_furnace')
    let level = $Minecraft.getInstance().level
    if (level) {
        let manager = level.getRecipeManager()
        let soulBlastMap = {}
        let hauntingType = $ForgeRegistries.RECIPE_TYPES.getValue(new ResourceLocation('create:haunting'))
        let infuserType = $ForgeRegistries.RECIPE_TYPES.getValue(new ResourceLocation('goety:cursed_infuser'))
        if (hauntingType) manager.getAllRecipesFor(hauntingType).forEach(r => global.addCreateHauntingRecipe(soulBlastMap, r))
        if (infuserType) manager.getAllRecipesFor(infuserType).forEach(r => global.addCursedInfuserRecipe(soulBlastMap, r))
        for (let input in soulBlastMap) {
            event.custom(soulBlastTypeId).add({
                input: input,
                output: soulBlastMap[input].output,
                soulCost: soulBlastMap[input].soulCost
            })
        }
    }
})

JEIAddedEvents.registerRecipeCatalysts(event => {
    const { data } = event
    const { jeiHelpers } = data
 
    let cyclotronTypeId = new ResourceLocation('requiem', 'cyclotron')
    let decayTypeId = new ResourceLocation('requiem', 'decay')
 
    data["addRecipeCatalyst(net.minecraft.world.item.ItemStack,mezz.jei.api.recipe.RecipeType[])"]
        (Item.of('kubejs:demon_core'), jeiHelpers.getRecipeType(cyclotronTypeId).get())
    data["addRecipeCatalyst(net.minecraft.world.item.ItemStack,mezz.jei.api.recipe.RecipeType[])"]
        (Item.of('kubejs:atomic_catalyst').setHoverName('右键放射核心以发射埃尔法粒子'), jeiHelpers.getRecipeType(cyclotronTypeId).get())

    data["addRecipeCatalyst(net.minecraft.world.item.ItemStack,mezz.jei.api.recipe.RecipeType[])"]
        (Item.of('kubejs:demon_core').setHoverName('在思索中查看水热反应堆的搭建'), jeiHelpers.getRecipeType(decayTypeId).get())

    data["addRecipeCatalyst(net.minecraft.world.item.ItemStack,mezz.jei.api.recipe.RecipeType[])"]
        (Item.of('kubejs:demon_core').setHoverName('在思索中查看水热反应堆的搭建'), jeiHelpers.getRecipeType(decayTypeId).get())
    data["addRecipeCatalyst(net.minecraft.world.item.ItemStack,mezz.jei.api.recipe.RecipeType[])"]
        (Item.of('minecraft:water_bucket'), jeiHelpers.getRecipeType(decayTypeId).get())

    let soulBlastTypeId = new ResourceLocation('requiem', 'soul_blast_furnace')
    data["addRecipeCatalyst(net.minecraft.world.item.ItemStack,mezz.jei.api.recipe.RecipeType[])"]
        (Item.of('kubejs:soul_blast_furnace'), jeiHelpers.getRecipeType(soulBlastTypeId).get())
})

const cyclotronRecipes = [
    {
        input:"minecraft:stone",
        output:"alexscaves:radrock",
        speed:0.3
    },
    {
        input:"minecraft:ice",
        output:"kubejs:porous_ice",
        speed:0.1
    },
    {
        input:"kubejs:thorium_block",
        output:"kubejs:plutonium_block",
        speed:2.4
    },
    {
        input:"kubejs:pure_uranium_block",
        output:"alexscaves:block_of_uranium",
        speed:2.0
    },
    {
        input:"minecraft:glass",
        output:"minecraft:yellow_stained_glass",
        speed:0.0
    }
]

const decayRecipes = [
    {
        input:'alexscaves:block_of_uranium',
        product:'alexscaves:packed_galena',
        duration: 64
    },
    {
        input: 'alexscaves:uranium_rod',
        product:'minecraft:air',
        duration: 16
    },
    {
        input:'alexscaves:unrefined_waste',
        product:'alexscaves:radrock',
        duration: 4
    },
    {
        input:'kubejs:pure_uranium_block',
        product:'kubejs:lead_block',
        duration: 576
    },
    {
        input:'kubejs:thorium_block',
        product:'kubejs:lead_block',
        duration: 192
    },
    {
        input:'kubejs:plutonium_block',
        product:'kubejs:thorium_block',
        duration: 192
    }
]

const hydrothermalRecipes = [
    {
        input:'minecraft:blue_ice',
        output:'minecraft:packed_ice',
        minFuel: 1
    },
    {
        input:'minecraft:packed_ice',
        output:'minecraft:ice',
        minFuel: 1
    },
    {
        input:'minecraft:ice',
        output:'minecraft:water_bucket',
        minFuel: 1
    },
    {
        input:'minecraft:water_bucket',
        output:'hotbath:hot_water_bucket',
        minFuel: 1
    },
    {
        input:'hotbath:hot_water_bucket',
        output:'ad_astra:hydrogen_bucket',
        minFuel: 5
    }
]