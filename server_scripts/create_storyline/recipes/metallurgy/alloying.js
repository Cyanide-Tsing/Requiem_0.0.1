ServerEvents.recipes(event => {
    //Steel Production
    event.remove({output: Fluid.of("createmetallurgy:molten_steel") });
    event.remove({input: Fluid.of("createmetallurgy:molten_steel") });
    event.remove({id:"createmetallurgy:casting_in_table/steel/ingot"});
    event.remove({id:"createmetallurgy:casting_in_table/steel/nugget"});
    event.remove({id:"createmetallurgy:casting_in_table/steel/rod"});
    event.remove({id:"createmetallurgy:casting_in_table/steel/plate"});
    event.remove({id:"createmetallurgy:casting_in_basin/steel/block"});

    event.recipes.createmetallurgy.casting_in_table("ad_astra:steel_ingot", [Item.of("createmetallurgy:graphite_ingot_mold"), Fluid.of("createbigcannons:molten_steel", 90)]).processingTime(60).id("requiem:casting_in_table/steel_ingot")
    event.recipes.createmetallurgy.casting_in_table("ad_astra:steel_nugget", [Item.of("createmetallurgy:graphite_nugget_mold"), Fluid.of("createbigcannons:molten_steel", 10)]).processingTime(6).id("requiem:casting_in_table/steel_nugget")
    event.recipes.createmetallurgy.casting_in_table("ad_astra:steel_plate", [Item.of("createmetallurgy:graphite_plate_mold"), Fluid.of("createbigcannons:molten_steel", 90)]).processingTime(60).id("requiem:casting_in_table/steel_plate")
    event.recipes.createmetallurgy.casting_in_table("vintageimprovements:steel_rod", [Item.of("createmetallurgy:graphite_rod_mold"), Fluid.of("createbigcannons:molten_steel", 45)]).processingTime(30).id("requiem:casting_in_table/steel_rod")
    event.recipes.createmetallurgy.casting_in_basin("ad_astra:steel_block", [Fluid.of("createbigcannons:molten_steel", 810)]).processingTime(540).id("requiem:casting_in_table/steel_block")

    event.recipes.vintageimprovements.pressurizing(Fluid.of("createbigcannons:molten_steel", 810), [Fluid.of("createbigcannons:molten_cast_iron", 810), Fluid.of("ad_astra:oxygen", 500)]).secondaryFluidInput(1).id("requiem:pressurizing/steel")
    event.recipes.vintageimprovements.pressurizing(Fluid.of("createbigcannons:molten_cast_iron", 810), [Fluid.of("createmetallurgy:molten_iron", 810), "createmetallurgy:coke"]).heated().id("requiem:pressurizing/cast_iron")
    event.recipes.createmetallurgy.alloying(Fluid.of("createbigcannons:molten_cast_iron", 810), [Fluid.of("createmetallurgy:molten_iron", 810), "createmetallurgy:coke"]).heated().id("requiem:alloying/cast_iron")

    event.recipes.createmetallurgy.casting_in_table("createbigcannons:cast_iron_ingot", [Item.of("createmetallurgy:graphite_ingot_mold"), Fluid.of("createbigcannons:molten_cast_iron", 90)]).processingTime(60).id("requiem:casting_in_table/cast_iron_ingot")
    event.recipes.createmetallurgy.casting_in_table("createbigcannons:cast_iron_nugget", [Item.of("createmetallurgy:graphite_nugget_mold"), Fluid.of("createbigcannons:molten_cast_iron", 10)]).processingTime(6).id("requiem:casting_in_table/cast_iron_nugget")
    event.recipes.createmetallurgy.casting_in_table("vintageimprovements:cast_iron_sheet", [Item.of("createmetallurgy:graphite_plate_mold"), Fluid.of("createbigcannons:molten_cast_iron", 90)]).processingTime(60).id("requiem:casting_in_table/cast_iron_plate")
    event.recipes.createmetallurgy.casting_in_table("vintageimprovements:cast_iron_rod", [Item.of("createmetallurgy:graphite_rod_mold"), Fluid.of("createbigcannons:molten_cast_iron", 45)]).processingTime(30).id("requiem:casting_in_table/cast_iron_rod")
    event.recipes.createmetallurgy.casting_in_basin("createbigcannons:cast_iron_block", [Fluid.of("createbigcannons:molten_cast_iron", 810)]).processingTime(540).id("requiem:casting_in_table/cast_iron_block")

    event.remove({id:"createbigcannons:compacting/iron_to_cast_iron_ingot"})
    event.remove({id:"createbigcannons:compacting/iron_to_cast_iron_block"})
    event.remove({id:"createbigcannons:compacting/forge_steel_ingot"})

    /*
        Desh Metal = Cu - Al
        Desh = AlFeF6
        Ostrum Metal = Fe - V
        Ostrum = CuV2O6
        Calorite Metal = W - Pt
        Calorite = Pt3Cu
    */
    // Removing smelting & blasting recipes
    event.remove({ type: 'minecraft:smelting', output: `ad_astra:desh_ingot` })
    event.remove({ type: 'minecraft:smelting', output: `ad_astra:ostrum_ingot` })
    event.remove({ type: 'minecraft:smelting', output: `ad_astra:calorite_ingot` })

    event.remove({ type: 'minecraft:blasting', output: `ad_astra:desh_ingot` })
    event.remove({ type: 'minecraft:blasting', output: `ad_astra:ostrum_ingot` })
    event.remove({ type: 'minecraft:blasting', output: `ad_astra:calorite_ingot` })

    // Melting crushed impure ores
    event.recipes.createmetallurgy.melting([Fluid.of("createmetallurgy:molten_iron", 90), Fluid.of("createmetallurgy:molten_slag",30)], Item.of("ad_astra:crushed_raw_desh")).heated().id("requiem:melting/crushed_raw_desh")
    event.recipes.createmetallurgy.melting([Fluid.of("createmetallurgy:molten_iron", 90), Fluid.of("createmetallurgy:molten_slag",30)], Item.of("ad_astra:dirty_desh_dust")).heated().id("requiem:melting/dirty_desh_dust")
    event.recipes.createmetallurgy.melting([Fluid.of("createmetallurgy:molten_iron", 90)], Item.of("ad_astra:desh_dust")).heated().id("requiem:melting/desh_dust")

    event.recipes.createmetallurgy.melting([Fluid.of("createmetallurgy:molten_gold", 90), Fluid.of("createmetallurgy:molten_slag",30)], Item.of("ad_astra:crushed_raw_ostrum")).heated().id("requiem:melting/crushed_raw_ostrum")
    event.recipes.createmetallurgy.melting([Fluid.of("createmetallurgy:molten_gold", 90), Fluid.of("createmetallurgy:molten_slag",30)], Item.of("ad_astra:dirty_ostrum_dust")).heated().id("requiem:melting/dirty_ostrum_dust")
    event.recipes.createmetallurgy.melting([Fluid.of("createmetallurgy:molten_gold", 90)], Item.of("ad_astra:ostrum_dust")).heated().id("requiem:melting/ostrum_dust")

    event.recipes.createmetallurgy.melting([Fluid.of("createmetallurgy:molten_copper", 90), Fluid.of("createmetallurgy:molten_slag",30)], Item.of("ad_astra:crushed_raw_calorite")).heated().id("requiem:melting/crushed_raw_calorite")
    event.recipes.createmetallurgy.melting([Fluid.of("createmetallurgy:molten_copper", 90), Fluid.of("createmetallurgy:molten_slag",30)], Item.of("ad_astra:dirty_calorite_dust")).heated().id("requiem:melting/dirty_calorite_dust")
    event.recipes.createmetallurgy.melting([Fluid.of("createmetallurgy:molten_copper", 90)], Item.of("ad_astra:calorite_dust")).heated().id("requiem:melting/calorite_dust")

    //Desh
    event.recipes.vintageimprovements.pressurizing(["kubejs:corundum_powder", "3x kubejs:fluorite", Fluid.of("kubejs:ferric_chloride", 90)], ["ad_astra:dirty_desh_dust", Fluid.of("kubejs:hydrochloric_acid", 90)]).id("requiem:pressurizing/dirty_desh_with_acid")
    event.recipes.vintageimprovements.pressurizing(["kubejs:corundum_powder", Fluid.of("kubejs:ferric_chloride", 90)], ["ad_astra:desh_dust", Fluid.of("kubejs:hydrochloric_acid", 90)]).id("requiem:pressurizing/desh_with_acid")
    event.recipes.vintageimprovements.pressurizing([Fluid.of("kubejs:molten_cryolite", 90), "createmetallurgy:iron_dust", "3x kubejs:fluorite"],[Fluid.of("kubejs:sodium_hydroxide", 1000), "ad_astra:dirty_desh_dust"]).heated().id('requiem:pressurizing/cryolite_from_dirty_desh')
    event.recipes.vintageimprovements.pressurizing([Fluid.of("kubejs:molten_cryolite", 90), "createmetallurgy:iron_dust"],[Fluid.of("kubejs:sodium_hydroxide", 1000), "ad_astra:desh_dust"]).heated().id('requiem:pressurizing/cryolite')
    event.recipes.vintageimprovements.pressurizing([Fluid.of("kubejs:molten_cryolite", 90), "createmetallurgy:iron_dust"],["kubejs:sodium_hydroxide", "kubejs:sodium_hydroxide", "kubejs:sodium_hydroxide", "ad_astra:desh_dust"]).heated().id('requiem:pressurizing/cryolite_with_solid_soda')

    event.recipes.vintageimprovements.pressurizing([Fluid.of("kubejs:molten_cryolite", 180)], [Fluid.of("kubejs:molten_cryolite", 90), Item.of("kubejs:corundum_powder")]).heated().secondaryFluidInput(0).id("requiem:pressurizing/cryolite_multiplication")

    event.recipes.vintageimprovements.pressurizing(
        [Item.of("kubejs:discharged_electrolyzer"), Fluid.of("createmetallurgy:molten_aluminum", 90), Fluid.of("ad_astra:oxygen", 500)],
        [Item.of("kubejs:electrolyzer"), Fluid.of("kubejs:molten_cryolite", 90)]
    )
    .heated()
    .secondaryFluidOutput(1)
    .id("vintageimprovements:pressurizing/electrolyze_Al")
    
    event.recipes.createmetallurgy.alloying(Fluid.of("createbigcannons:molten_bronze", 90), [Fluid.of("createmetallurgy:molten_copper", 90), Fluid.of("createmetallurgy:molten_aluminum", 10)]).id("requiem:alloying/desh")

    event.recipes.createmetallurgy.casting_in_table("ad_astra:desh_ingot", [Item.of("createmetallurgy:graphite_ingot_mold"), Fluid.of("createbigcannons:molten_bronze", 90)]).processingTime(60).id("requiem:casting_in_table/desh_ingot")
    event.recipes.createmetallurgy.casting_in_table("ad_astra:desh_nugget", [Item.of("createmetallurgy:graphite_nugget_mold"), Fluid.of("createbigcannons:molten_bronze", 10)]).processingTime(6).id("requiem:casting_in_table/desh_nugget")
    event.recipes.createmetallurgy.casting_in_table("ad_astra:desh_plate", [Item.of("createmetallurgy:graphite_plate_mold"), Fluid.of("createbigcannons:molten_bronze", 90)]).processingTime(60).id("requiem:casting_in_table/desh_plate")
    event.recipes.createmetallurgy.casting_in_table("vintageimprovements:desh_rod", [Item.of("createmetallurgy:graphite_rod_mold"), Fluid.of("createbigcannons:molten_bronze", 45)]).processingTime(30).id("requiem:casting_in_table/desh_rod")
    event.recipes.createmetallurgy.casting_in_basin("ad_astra:desh_block", [Fluid.of("createbigcannons:molten_bronze", 810)]).processingTime(540).id("requiem:casting_in_table/desh_block")



})