ServerEvents.recipes(event=>{
    event.recipes.vintageimprovements.curving(Item.of("kubejs:empty_can"), 'ad_astra:steel_plate').mode(0).id("requiem:curving/empty_can")

    event.recipes.vintageimprovements.pressurizing(Fluid.of("kubejs:meat_stew"), [Fluid.of("ratatouille:mince_meat", 250), Fluid.of("water", 750)]).processingTime(200).heated().id("requiem:pressurizing/meat_stew")
    event.recipes.vintageimprovements.pressurizing(Fluid.of("kubejs:tomato_pea_soup"), ['farmersdelight:tomato', 'farmersdelight:tomato', 'farmersdelight:tomato', 'farmersdelight:tomato', 'smc:pea', 'smc:pea', Fluid.of("minecraft:milk", 500)]).processingTime(150).heated().id("requiem:pressurizing/tomato_pea_soup")

    event.recipes.create.sequenced_assembly(
        "kubejs:canned_tomato_pea_soup",
        "kubejs:empty_can",
        [
            event.recipes.create.filling("kubejs:empty_can", ["kubejs:empty_can", Fluid.of("kubejs:tomato_pea_soup", 250)]),
            event.recipes.create.deploying("kubejs:empty_can", ["kubejs:empty_can", "ratatouille:salt"]),
            event.recipes.create.deploying("kubejs:empty_can", ["kubejs:empty_can", "iron_nugget"])
        ]
    ).transitionalItem("kubejs:empty_can").loops(1).id("requiem:sequenced_assembly/canned_tomato_pea_soup")

    event.recipes.create.sequenced_assembly(
        "kubejs:canned_meat_stew",
        "kubejs:empty_can",
        [
            event.recipes.create.filling("kubejs:empty_can", ["kubejs:empty_can", Fluid.of("kubejs:meat_stew", 250)]),
            event.recipes.create.deploying("kubejs:empty_can", ["kubejs:empty_can", "iron_nugget"])
        ]
    ).transitionalItem("kubejs:empty_can").loops(1).id("requiem:sequenced_assembly/canned_meat_stew")
})