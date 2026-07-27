ServerEvents.recipes(event => {
    //Obtain regular clusters
    event.recipes.vintageimprovements.pressurizing([Fluid.of("createmetallurgy:molten_slag", 1000), Item.of("kubejs:lithophilic_cluster").withChance(0.75)], [Fluid.of("minecraft:lava", 1000), Fluid.of("ad_astra:oxygen", 500)]).secondaryFluidInput(1).id("requiem:pressurizing/lithophile")
    event.recipes.vintageimprovements.pressurizing([Fluid.of("createmetallurgy:molten_slag", 1000), Item.of("kubejs:chalcophilic_cluster").withChance(0.5)], [Fluid.of("minecraft:lava", 1000), Item.of("alexscaves:sulfur_dust", 3)]).id("requiem:pressurizing/chalcoophile")
    event.recipes.vintageimprovements.pressurizing([Fluid.of("kubejs:molten_quartz", 1000), Item.of("kubejs:lithophilic_cluster").withChance(0.5)], [Fluid.of("createmetallurgy:molten_slag", 1000), Fluid.of("ad_astra:oxygen", 500)]).secondaryFluidInput(1).id("requiem:pressurizing/lithophile_from_molten_slag")
    event.recipes.vintageimprovements.pressurizing([Fluid.of("kubejs:molten_quartz", 1000), Item.of("kubejs:chalcophilic_cluster").withChance(0.75)], [Fluid.of("createmetallurgy:molten_slag", 1000), Item.of("alexscaves:sulfur_dust", 3)]).id("requiem:pressurizing/chalcoophile_from_molten_slag")

    //Obtain rare earth clusters
    event.recipes.vintageimprovements.pressurizing(
        [
            Item.of("kubejs:rare_earth_cluster").withChance(0.4), 
            Item.of("minecraft:raw_iron", 1).withChance(0.4),
            Item.of("createmetallurgy:raw_tungsten", 1).withChance(0.4),
            Item.of("quark:white_corundum_cluster", 1).withChance(0.8)
        ],
        [
            Item.of("kubejs:lithophilic_cluster", 1),
            Fluid.of("kubejs:ethylene_carbonate", 125)
        ]
    ).secondaryFluidInput(0).id("requiem:pressurizing/rare_earth_from_lithophiles")

    event.recipes.vintageimprovements.pressurizing(
        [
            Item.of("kubejs:rare_earth_cluster").withChance(0.4), 
            Item.of("minecraft:raw_copper", 1).withChance(0.4),
            Item.of("create:raw_zinc", 1).withChance(0.4),
            Item.of("iceandfire:raw_silver", 1).withChance(0.4),
            Item.of("kubejs:raw_lead", 1).withChance(0.4)
        ],
        [
            Item.of("kubejs:chalcophilic_cluster", 1),
            Fluid.of("kubejs:ethylene_carbonate", 125)
        ]
    ).secondaryFluidInput(0).id("requiem:pressurizing/rare_earth_from_chalcophiles")

    //crushing 3 clusters
    event.recipes.create.crushing(
        [
            Item.of("create:crushed_raw_iron", 1),
            Item.of("create:crushed_raw_iron", 1).withChance(0.5),
            Item.of("createmetallurgy:crushed_raw_tungsten", 1),
            Item.of("kubejs:corundum_powder", 2)
        ],
        Item.of("kubejs:lithophilic_cluster")
    ).id("requiem:crushing/lithophilic_cluster")

    event.recipes.create.crushing(
        [
            Item.of("create:crushed_raw_copper", 1),
            Item.of("create:crushed_raw_copper", 1).withChance(0.5),
            Item.of("create:crushed_raw_zinc", 1),
            Item.of("create:crushed_raw_silver", 1),
            Item.of("create:crushed_raw_lead", 1)
        ],
        Item.of("kubejs:chalcoophilic_cluster")
    ).id("requiem:crushing/chalcophilic_cluster")

    event.recipes.create.crushing(
        [
            Item.of("create:crushed_raw_lead", 1),
            Item.of("create:crushed_raw_lead", 1).withChance(0.5),
            Item.of("alexscaves:raw_scarlet_neodymium", 1),
            Item.of("alexscaves:raw_azure_neodymium", 1),
            Item.of("kubejs:vanadium_oxide", 1).withChance(0.5)
        ],
        Item.of("kubejs:rare_earth_cluster")
    ).id("requiem:crushing/rare_earth_cluster")
})