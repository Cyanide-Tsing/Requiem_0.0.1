ServerEvents.recipes(event=>{
    //removal of original silicon recipe
    event.remove({id:"refinedstorage:silicon"})

    //Casting Quartz
    event.recipes.createmetallurgy.casting_in_table('minecraft:quartz', Fluid.of("kubejs:molten_quartz", 100)).processingTime(10).id("requiem:casting_in_table/quartz")
    event.recipes.createmetallurgy.casting_in_basin('minecraft:quartz_block', Fluid.of("kubejs:molten_quartz", 400)).processingTime(20).id("requiem:casting_in_basin/quartz")

    //Production of high-purity silicon
    event.recipes.vintageimprovements.pressurizing([Fluid.of("kubejs:silicon_tetrachloride", 250), Fluid.of("kubejs:carbon_dioxide", 250)], [Fluid.of("kubejs:molten_quartz", 100), '#minecraft:coals', Fluid.of("kubejs:chlorine", 500)]).secondaryFluidInput(1).id("requiem:pressurizing/silicon_tetrachloride_from_molten_quartz")
    event.recipes.vintageimprovements.pressurizing([Fluid.of("kubejs:silicon_tetrachloride", 250), Fluid.of("kubejs:carbon_dioxide", 250)], ['minecraft:quartz', '#minecraft:coals', Fluid.of("kubejs:chlorine", 500)]).secondaryFluidInput(0).heated().id("requiem:pressurizing/silicon_tetrachloride")
    event.recipes.vintageimprovements.pressurizing(["refinedstorage:silicon", Fluid.of("kubejs:hydrochloric_acid", 1000)], [Fluid.of('kubejs:silicon_tetrachloride', 250), Fluid.of('ad_astra:hydrogen', 500)]).secondaryFluidInput(1).heated().id("requiem:pressurizing/pure_silicon")

    //Oxidizing Silicon
    event.blasting("minecraft:quartz", "refinedstorage:silicon").id("requiem:blasting/quartz_from_pure_silicon")

    //Destroying Silicon Tetrachloride
    event.recipes.vintageimprovements.pressurizing(["minecraft:quartz", Fluid.of("kubejs:hydrochloric_acid", 1000)], [Fluid.of('kubejs:silicon_tetrachloride', 250), Fluid.of('minecraft:water', 500)]).secondaryFluidInput(1).heated().id("requiem:pressurizing/quartz_from_destroying_silicon_tetrachloride")
})