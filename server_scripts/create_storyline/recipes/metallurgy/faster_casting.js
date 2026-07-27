ServerEvents.recipes(event=>{
    event.recipes.create.compacting("minecraft:iron_ingot", Fluid.of("createmetallurgy:molten_iron", 90)).id("requiem:compacting/iron_ingot_from_fluid")
    event.recipes.create.compacting("minecraft:copper_ingot", Fluid.of("createmetallurgy:molten_copper", 90)).id("requiem:compacting/copper_ingot_from_fluid")
    event.recipes.create.compacting("minecraft:gold_ingot", Fluid.of("createmetallurgy:molten_gold", 90)).id("requiem:compacting/gold_ingot_from_fluid")
    event.recipes.create.compacting("minecraft:netherite_ingot", Fluid.of("createmetallurgy:molten_netherite", 90)).id("requiem:compacting/netherite_ingot_from_fluid")
    event.recipes.create.compacting("create:zinc_ingot", Fluid.of("createmetallurgy:molten_zinc", 90)).id("requiem:compacting/zinc_ingot_from_fluid")
    event.recipes.create.compacting("create:brass_ingot", Fluid.of("createmetallurgy:molten_brass", 90)).id("requiem:compacting/brass_ingot_from_fluid")
})