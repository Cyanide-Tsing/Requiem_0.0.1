const removed_ores = [
    'iron',
    'copper',
    'zinc',
    'gold',
    'lead',
    'silver',
    'uranium',
    'desh',
    'ostrum',
    'calorite',
    'tungsten'
];

ServerEvents.recipes(event => {
    removed_ores.forEach(material => {
        event.remove({ type: 'create:crushing', output: `#forge:raw_materials/${material}` });
        event.remove({ type: 'create:crushing', output: `create:crushed_raw_${material}` });
        event.remove({ type: 'create:crushing', output: `createmetallurgy:crushed_raw_${material}` });
        //event.remove({ type: 'create:milling', input: `createmetallurgy:crushed_raw_${material}` });
    });

    //1st crushing
    event.recipes.create.crushing([Item.of("create:crushed_raw_iron",2),Item.of("create:crushed_raw_iron",1).withChance(0.5)], ["#forge:ores/iron"]).id("requiem:crushing/iron_ores")
    event.recipes.create.crushing([Item.of("create:crushed_raw_copper",2),Item.of("create:crushed_raw_copper",1).withChance(0.5)], ["#forge:ores/copper"]).id("requiem:crushing/copper_ores")
    event.recipes.create.crushing([Item.of("create:crushed_raw_zinc",2),Item.of("create:crushed_raw_zinc",1).withChance(0.5)], ["#forge:ores/zinc"]).id("requiem:crushing/zinc_ores")
    event.recipes.create.crushing([Item.of("create:crushed_raw_gold",2),Item.of("create:crushed_raw_gold",1).withChance(0.5)], ["#forge:ores/gold"]).id("requiem:crushing/gold_ores")
    event.recipes.create.crushing([Item.of("create:crushed_raw_uranium",2),Item.of("create:crushed_raw_uranium",1).withChance(0.5)], ["alexscaves:radrock_uranium_ore"]).id("requiem:crushing/uranium_ores")
    event.recipes.create.crushing([Item.of("create:crushed_raw_silver",2),Item.of("create:crushed_raw_silver",1).withChance(0.5)], ["#forge:ores/silver"]).id("requiem:crushing/silver_ores")
    event.recipes.create.crushing([Item.of("createmetallurgy:crushed_raw_tungsten",2),Item.of("createmetallurgy:crushed_raw_tungsten",1).withChance(0.5)], ["#forge:ores/tungsten"]).id("requiem:crushing/tungsten_ores")
    event.recipes.create.crushing([Item.of("create:crushed_raw_lead",2),Item.of("create:crushed_raw_lead",1).withChance(0.5)], ["alexscaves:galena"]).id("requiem:crushing/galena")
    event.recipes.create.crushing([Item.of("create:crushed_raw_lead",2),Item.of("create:crushed_raw_lead",1).withChance(0.5),Item.of("kubejs:vanadium_oxide",1).withChance(0.1)], ["kubejs:galena_vanadinite"]).id("requiem:crushing/vanadinite")

    event.recipes.create.crushing([Item.of("ad_astra:crushed_raw_desh",2),Item.of("ad_astra:crushed_raw_desh",1).withChance(0.5)], ["#forge:ores/desh"]).id("requiem:crushing/desh_ores")
    event.recipes.create.crushing([Item.of("ad_astra:crushed_raw_ostrum",2),Item.of("ad_astra:crushed_raw_ostrum",1).withChance(0.5)], ["#forge:ores/ostrum"]).id("requiem:crushing/ostrum_ores")
    event.recipes.create.crushing([Item.of("ad_astra:crushed_raw_calorite",2),Item.of("ad_astra:crushed_raw_calorite",1).withChance(0.5)], ["#forge:ores/calorite"]).id("requiem:crushing/calorite_ores")

    event.recipes.create.crushing("create:crushed_raw_iron", "minecraft:raw_iron").id("requiem:crushing/raw_iron")
    event.recipes.create.crushing("create:crushed_raw_iron", "spelunkery:raw_magnetite").id("requiem:crushing/raw_magnetite")
    event.recipes.create.crushing("create:crushed_raw_copper", "minecraft:raw_copper").id("requiem:crushing/raw_copper")
    event.recipes.create.crushing("create:crushed_raw_gold", "minecraft:raw_gold").id("requiem:crushing/raw_gold")
    event.recipes.create.crushing("create:crushed_raw_zinc", "create:raw_zinc").id("requiem:crushing/raw_zinc")
    event.recipes.create.crushing("create:crushed_raw_silver", "iceandfire:raw_silver").id("requiem:crushing/raw_silver")
    event.recipes.create.crushing("create:crushed_raw_uranium", "alexscaves:uranium").id("requiem:crushing/raw_uranium")
    event.recipes.create.crushing("create:crushed_raw_lead", "kubejs:vanadinite").id("requiem:crushing/raw_vanadite")
    event.recipes.create.crushing("create:crushed_raw_lead", "kubejs:raw_lead").id("requiem:crushing/raw_lead")
    event.recipes.create.crushing("createmetallurgy:crushed_raw_tungsten", "createmetallurgy:raw_tungsten").id("requiem:crushing/raw_tungsten")

    event.recipes.create.crushing("ad_astra:crushed_raw_desh", "ad_astra:raw_desh").id("requiem:crushing/raw_desh")
    event.recipes.create.crushing("ad_astra:crushed_raw_ostrum", "ad_astra:raw_ostrum").id("requiem:crushing/raw_ostrum")
    event.recipes.create.crushing("ad_astra:crushed_raw_calorite", "ad_astra:raw_calorite").id("requiem:crushing/raw_calorite")

    //2nd crushing
    event.recipes.create.crushing([Item.of("createmetallurgy:dirty_iron_dust",1),Item.of("createmetallurgy:dirty_iron_dust",1).withChance(0.5)], [Item.of("create:crushed_raw_iron",1)]).id("requiem:crushing/crushed_iron")
    event.recipes.create.crushing([Item.of("createmetallurgy:dirty_copper_dust",1),Item.of("createmetallurgy:dirty_copper_dust",1).withChance(0.5)], [Item.of("create:crushed_raw_copper",1)]).id("requiem:crushing/crushed_copper")
    event.recipes.create.crushing([Item.of("createmetallurgy:dirty_zinc_dust",1),Item.of("createmetallurgy:dirty_zinc_dust",1).withChance(0.5)], [Item.of("create:crushed_raw_zinc",1)]).id("requiem:crushing/crushed_zinc")
    event.recipes.create.crushing([Item.of("createmetallurgy:dirty_gold_dust",1),Item.of("createmetallurgy:dirty_gold_dust",1).withChance(0.5)], [Item.of("create:crushed_raw_gold",1)]).id("requiem:crushing/crushed_gold")
    event.recipes.create.crushing([Item.of("createmetallurgy:dirty_tungsten_dust",1),Item.of("createmetallurgy:dirty_tungsten_dust",1).withChance(0.5)], [Item.of("createmetallurgy:crushed_raw_tungsten",1)]).id("requiem:crushing/crushed_tungsten")
    event.recipes.create.crushing([Item.of("iceandfire:dirty_silver_dust",1),Item.of("iceandfire:dirty_silver_dust",1).withChance(0.5)], [Item.of("create:crushed_raw_silver",1)]).id("requiem:crushing/crushed_silver")
    event.recipes.create.crushing([Item.of("kubejs:dirty_lead_dust",1),Item.of("kubejs:dirty_lead_dust",1).withChance(0.5)], [Item.of("create:crushed_raw_lead",1)]).id("requiem:crushing/crushed_lead")
    event.recipes.create.crushing([Item.of("kubejs:dirty_uranium_dust",1),Item.of("kubejs:dirty_uranium_dust",1).withChance(0.5)], [Item.of("create:crushed_raw_uranium",1)]).id("requiem:crushing/crushed_uranium")

    event.recipes.create.crushing([Item.of("ad_astra:dirty_desh_dust",1),Item.of("ad_astra:dirty_desh_dust",1).withChance(0.5)], [Item.of("ad_astra:crushed_raw_desh",1)]).id("requiem:crushing/crushed_desh")
    event.recipes.create.crushing([Item.of("ad_astra:dirty_ostrum_dust",1),Item.of("ad_astra:dirty_ostrum_dust",1).withChance(0.5)], [Item.of("ad_astra:crushed_raw_ostrum",1)]).id("requiem:crushing/crushed_ostrum")
    event.recipes.create.crushing([Item.of("ad_astra:dirty_calorite_dust",1),Item.of("ad_astra:dirty_calorite_dust",1).withChance(0.5)], [Item.of("ad_astra:crushed_raw_calorite",1)]).id("requiem:crushing/crushed_calorite")

    //1st leaching
    event.recipes.create.mixing([Fluid.of("kubejs:ferric_chloride", 180), Item.of("minecraft:redstone", 3).withChance(0.5)], [Item.of("create:crushed_raw_iron"), Fluid.of("kubejs:hydrochloric_acid", 270)]).id("requiem:mixing/crushed_iron")
    event.recipes.create.mixing([Fluid.of("kubejs:copper_chloride", 180), Item.of("minecraft:clay_ball", 3).withChance(0.5)], [Item.of("create:crushed_raw_copper"), Fluid.of("kubejs:hydrochloric_acid", 180)]).id("requiem:mixing/crushed_copper")
    event.recipes.create.mixing([Fluid.of("kubejs:zinc_chloride", 180), Item.of("spelunkery:sulfur", 3).withChance(0.5)], [Item.of("create:crushed_raw_zinc"), Fluid.of("kubejs:hydrochloric_acid", 180)]).id("requiem:mixing/crushed_zinc")

    event.recipes.create.mixing([Fluid.of("kubejs:silver_nitrate", 180), Item.of("spelunkery:sulfur", 3).withChance(0.5)], [Item.of("create:crushed_raw_silver"), Fluid.of("kubejs:nitric_acid", 180)]).id("requiem:mixing/crushed_silver")
    event.recipes.create.mixing([Fluid.of("kubejs:lead_nitrate", 180), Item.of("spelunkery:sulfur", 3).withChance(0.5)], [Item.of("create:crushed_raw_lead"), Fluid.of("kubejs:nitric_acid", 180)]).id("requiem:mixing/crushed_lead")
    event.recipes.create.mixing([Fluid.of("kubejs:raw_uranyl_nitrate", 180), Item.of("kubejs:fluorite", 3).withChance(0.5)], [Item.of("create:crushed_raw_uranium"), Fluid.of("kubejs:nitric_acid", 180)]).id("requiem:mixing/crushed_uranium")

    event.recipes.create.mixing([Item.of("minecraft:gold_nugget", 18), Item.of("minecraft:quartz")], [Item.of("create:crushed_raw_gold"), Fluid.of("kubejs:nitric_acid", 180)]).id("requiem:pressurzing/crushed_gold")
    event.recipes.create.mixing([Item.of("kubejs:platinum_nugget", 18), Item.of("minecraft:gold_nugget")], [Item.of("create:crushed_raw_platinum"), Fluid.of("kubejs:nitric_acid", 180)]).id("requiem:pressurzing/crushed_platinum")
    
    //2nd leaching
    event.recipes.create.mixing([Fluid.of("kubejs:ferric_chloride", 270), Item.of("minecraft:redstone", 3).withChance(0.5)], [Item.of("createmetallurgy:dirty_iron_dust"), Fluid.of("kubejs:hydrochloric_acid", 405)]).id("requiem:mixing/dirty_iron_dust")
    event.recipes.create.mixing([Fluid.of("kubejs:copper_chloride", 270), Item.of("minecraft:clay_ball", 3).withChance(0.5)], [Item.of("createmetallurgy:dirty_copper_dust"), Fluid.of("kubejs:hydrochloric_acid", 270)]).id("requiem:mixing/dirty_copper_dust")
    event.recipes.create.mixing([Fluid.of("kubejs:zinc_chloride", 270), Item.of("spelunkery:sulfur", 3).withChance(0.5)], [Item.of("createmetallurgy:dirty_zinc_dust"), Fluid.of("kubejs:hydrochloric_acid", 270)]).id("requiem:mixing/dirty_zinc_dust")

    event.recipes.create.mixing([Fluid.of("kubejs:silver_nitrate", 270), Item.of("spelunkery:sulfur", 3).withChance(0.5)], [Item.of("iceandfire:dirty_silver_dust"), Fluid.of("kubejs:nitric_acid", 270)]).id("requiem:mixing/dirty_silver_dust")
    event.recipes.create.mixing([Fluid.of("kubejs:lead_nitrate", 270), Item.of("spelunkery:sulfur", 3).withChance(0.5)], [Item.of("kubejs:dirty_lead_dust"), Fluid.of("kubejs:nitric_acid", 270)]).id("requiem:mixing/dirty_lead_dust")
    event.recipes.create.mixing([Fluid.of("kubejs:raw_uranyl_nitrate", 270), Item.of("kubejs:fluorite", 3).withChance(0.5)], [Item.of("createmetallurgy:dirty_uranium_dust"), Fluid.of("kubejs:nitric_acid", 270)]).id("requiem:mixing/dirty_uranium_dust")

    event.recipes.create.mixing([Item.of("createmetallurgy:gold_powder", 3), Item.of("minecraft:quartz")], [Item.of("createmetallurgy:dirty_gold_powder"), Fluid.of("kubejs:nitric_acid", 180)]).id("requiem:pressurzing/dirty_gold_powder")

    //Washing New Dirty Dusts
    event.recipes.create.splashing([Item.of("iceandfire:silver_dust"), Item.of("createmetallurgy:dirty_zinc_dust").withChance(0.5)], Item.of("iceandfire:dirty_silver_dust")).id("requiem:splashing/dirty_silver_dust")
    event.recipes.create.splashing([Item.of("kubejs:lead_dust"), Item.of("iceandfire:dirty_silver_dust").withChance(0.5)], Item.of("kubejs:dirty_lead_dust")).id("requiem:splashing/dirty_lead_dust")

    event.recipes.create.splashing([Item.of("ad_astra:desh_dust"), Item.of("kubejs:fluorite")], Item.of("ad_astra:dirty_desh_dust")).id("requiem:splashing/dirty_desh_dust")
    event.recipes.create.splashing([Item.of("ad_astra:ostrum_dust"), Item.of("kubejs:dirty_lead_dust").withChance(0.5)], Item.of("ad_astra:dirty_ostrum_dust")).id("requiem:splashing/dirty_ostrum_dust")
    event.recipes.create.splashing([Item.of("ad_astra:calorite_dust"), Item.of("kubejs:lime_powder")], Item.of("ad_astra:dirty_calorite_dust")).id("requiem:splashing/dirty_calorite_dust")

    //electrolysis
    event.recipes.vintageimprovements.pressurizing(
        [Item.of("kubejs:discharged_electrolyzer"), Item.of("createmetallurgy:iron_dust"), Fluid.of("kubejs:chlorine", 375)],
        [Item.of("kubejs:electrolyzer"), Fluid.of("kubejs:ferric_chloride", 90)]
    )
    .secondaryFluidOutput(0)
    .id("vintageimprovements:pressurizing/electrolyze_FeCl3")

    event.recipes.vintageimprovements.pressurizing(
        [Item.of("kubejs:discharged_electrolyzer"), Item.of("createmetallurgy:copper_dust"), Fluid.of("kubejs:chlorine", 250)],
        [Item.of("kubejs:electrolyzer"), Fluid.of("kubejs:copper_chloride", 90)]
    )
    .secondaryFluidOutput(0)
    .id("vintageimprovements:pressurizing/electrolyze_CuCl2")

    event.recipes.vintageimprovements.pressurizing(
        [Item.of("kubejs:discharged_electrolyzer"), Item.of("createmetallurgy:zinc_dust"), Fluid.of("kubejs:chlorine", 250)],
        [Item.of("kubejs:electrolyzer"), Fluid.of("kubejs:zinc_chloride", 90)]
    )
    .secondaryFluidOutput(0)
    .id("vintageimprovements:pressurizing/electrolyze_ZnCl2")

    //hydrogen reduction
    event.recipes.vintageimprovements.pressurizing(
        Fluid.of("createmetallurgy:molten_iron", 135),
        [Fluid.of("kubejs:ferric_chloride", 180), Fluid.of("ad_astra:hydrogen", 500)]
    ).heated()
    .secondaryFluidInput(1)
    .id("requiem:pressurizing/H2Red_FeCl3")

    event.recipes.vintageimprovements.pressurizing(
        Fluid.of("createmetallurgy:molten_copper", 135),
        [Fluid.of("kubejs:copper_chloride", 180), Fluid.of("ad_astra:hydrogen", 500)]
    ).heated()
    .secondaryFluidInput(1)
    .id("requiem:pressurizing/H2Red_CuCl2")

    event.recipes.vintageimprovements.pressurizing(
        Fluid.of("createmetallurgy:molten_zinc", 90),
        [Fluid.of("kubejs:zinc_chloride", 180), Fluid.of("ad_astra:hydrogen", 500)]
    ).heated()
    .secondaryFluidInput(1)
    .id("requiem:pressurizing/H2Red_ZnCl3")

    //zinc reduction
    event.recipes.create.mixing(
        [Item.of("createmetallurgy:iron_dust",2), Fluid.of("kubejs:zinc_chloride", 270)],
        [Item.of("createmetallurgy:zinc_dust",3), Fluid.of("kubejs:ferric_chloride", 180)]
    )
    .id("requiem:mixing/ZnRed_FeCl3")

    event.recipes.create.mixing(
        [Item.of("createmetallurgy:copper_dust"), Fluid.of("kubejs:zinc_chloride", 90)],
        [Item.of("createmetallurgy:zinc_dust"), Fluid.of("kubejs:copper_chloride", 90)]
    )
    .id("requiem:mixing/ZnRed_CuCl2")

    //Mg reduction AQUEOUS
    event.recipes.create.mixing(
        [Item.of("createmetallurgy:iron_dust",2), Item.of("kubejs:magnesalt", 3)],
        [Item.of("kubejs:magnesium_powder",3), Fluid.of("kubejs:ferric_chloride", 180)]
    )
    .id("requiem:mixing/MgRed_FeCl3")

    event.recipes.create.mixing(
        [Item.of("createmetallurgy:copper_dust"), Item.of("kubejs:magnesalt")],
        [Item.of("kubejs:magnesium_powder"), Fluid.of("kubejs:copper_chloride", 90)]
    )
    .id("requiem:mixing/MgRed_CuCl2")

    event.recipes.create.mixing(
        [Item.of("createmetallurgy:zinc_dust"), Item.of("kubejs:magnesalt")],
        [Item.of("kubejs:magnesium_powder"), Fluid.of("kubejs:zinc_chloride", 90)]
    )
    .id("requiem:mixing/MgRed_ZnCl2")

    event.recipes.create.mixing(
        [Item.of("kubejs:lead_dust"), Fluid.of("kubejs:magnesium_nitrate", 90)],
        [Item.of("kubejs:magnesium_powder"), Fluid.of("kubejs:lead_nitrate", 90)]
    )
    .id("requiem:mixing/MgRed_Pb")

    event.recipes.create.mixing(
        [Item.of("iceandfire:silver_dust"), Fluid.of("kubejs:magnesium_nitrate", 90)],
        [Item.of("kubejs:magnesium_powder"), Fluid.of("kubejs:silver_nitrate", 90)]
    )
    .id("requiem:mixing/MgRed_Ag")

    //Mg thermal reduction
    event.recipes.vintageimprovements.pressurizing(
        [Item.of("vintageimprovements:vanadium_ingot"), Item.of("kubejs:magnesia")],
        [Item.of("kubejs:vanadium_oxide"), Item.of("kubejs:magnesium_powder")]
    ).heated().id("requiem:pressurizing/vanadium")

    //BLASTING DUSTS
    const blastables = [
        "iron",
        "copper",
        "zinc",
        "gold",
        "silver",
        "lead"
    ]

    blastables.forEach(metal => {
        event.blasting("#forge:ingots/"+metal, "#forge:dusts/"+metal).id("requiem:blasting/"+metal+"_dust")
    })
});

ServerEvents.tags('item', event=>{
    event.add("forge:ingots/lead", "kubejs:lead_ingot");
    event.add("forge:raw_materials/lead", "kubejs:raw_lead");
    event.add("forge:nuggets/lead", "kubejs:lead_nugget")
    event.add("forge:dusts/lead", "kubejs:lead_dust")
    event.add("forge:dirty_dusts/lead", "kubejs:dirty_lead_dust")
    event.add("forge:ingots/platinum", "kubejs:platinum_ingot")
    event.add("forge:nuggets/platinum", "kubejs:platinum_nugget")
    event.add("forge:blocks/platinum", "kubejs:platinum_block")
    event.add("forge:dusts/silver", "iceandfire:silver_dust")
    event.add("forge:dirty_dusts/silver", "kubejs:dirty_silver_dust")
    event.add("forge:ingots/aluminum", "kubejs:aluminum_chunk")
})