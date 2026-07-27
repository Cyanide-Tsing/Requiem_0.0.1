ServerEvents.recipes(event=>{
    event.recipes.create.sequenced_assembly(
        Item.of("kubejs:gas_grenade"),
        Item.of("kubejs:empty_can"),
        [
            event.recipes.create.deploying('kubejs:empty_can', ['kubejs:empty_can', 'createbigcannons:guncotton']),
            event.recipes.create.filling('kubejs:empty_can', ['kubejs:empty_can', Fluid.of("kubejs:chlorine")]),
            event.recipes.create.deploying('kubejs:empty_can', ['kubejs:empty_can', 'minecraft:iron_nugget'])
        ]
    ).transitionalItem('kubejs:empty_can')
    .loops(1)
    .id("requiem:sequenced_assembly/gas_grenade")
})