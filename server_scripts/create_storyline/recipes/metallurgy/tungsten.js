ServerEvents.recipes(event=>{
    event.recipes.create.mixing(['kubejs:sodium_tungstate', Item.of('createmetallurgy:iron_dust').withChance(0.25)], ['2x kubejs:sodium_hydroxide', 'createmetallurgy:tungsten_dust']).id('requiem:mixing/tungstate')
    event.recipes.create.mixing(['kubejs:sodium_tungstate', Item.of('createmetallurgy:dirty_iron_dust'), Item.of('minecraft:gold_nugget').withChance(0.5)], ['2x kubejs:sodium_hydroxide', 'createmetallurgy:dirty_tungsten_dust']).id('requiem:mixing/dirty_tungstate')
    event.recipes.create.mixing(['kubejs:scheelite', Item.of('createmetallurgy:iron_dust').withChance(0.25)], ['kubejs:lime', 'createmetallurgy:tungsten_dust']).id("requiem:mixing/scheelite_from_tungstate")
    event.recipes.create.mixing(['kubejs:scheelite', Item.of('createmetallurgy:iron_dust').withChance(0.25), Item.of('minecraft:gold_nugget').withChance(0.5)], ['kubejs:lime', 'createmetallurgy:dirty_tungsten_dust']).id("requiem:mixing/scheelite_from_dirty_tungstate")
    event.recipes.vintageimprovements.pressurizing(["2x kubejs:sodium_tungstate", "2x createmetallurgy:iron_dust"],[Fluid.of("kubejs:sodium_hydroxide", 1000), "createmetallurgy:tungsten_dust"]).id('requiem:pressurizing/more_tungstate')
    event.recipes.vintageimprovements.pressurizing(["2x kubejs:sodium_tungstate", "2x createmetallurgy:iron_dust", Item.of('minecraft:gold_nugget').withChance(0.5)],[Fluid.of("kubejs:sodium_hydroxide", 1000), "createmetallurgy:dirty_tungsten_dust"]).id('requiem:pressurizing/more_tungstate_from_dirty')


    event.custom({
        "type":"vintageimprovements:pressurizing",
        "secondaryFluidInput": 0,
        "heatRequirement": "heated",
        "ingredients": [ 
            {
                "item": "kubejs:sodium_tungstate",
            },
            {
                "item": "kubejs:sodium_tungstate",
            },
            {
                "fluid": "ad_astra:hydrogen",
                "amount": 1000
            }
        ],
        "results": [
            {
                "item": "kubejs:sodium_hydroxide",
                "count": 4
            },
            {
                "fluid": "createmetallurgy:molten_tungsten",
                "amount": 270
            }
        ],
        "processingTime": 40
    }).id("vintageimprovements:pressurizing/tungsten")
    event.recipes.create.mixing([Fluid.of("createmetallurgy:molten_tungsten", 90), 'kubejs:soda_powder'], ['minecraft:charcoal','kubejs:sodium_tungstate']).superheated().id('requiem:mixing/tungsten')
    event.recipes.create.mixing([Fluid.of("createmetallurgy:molten_tungsten", 90), 'kubejs:soda_powder'], ['createmetallurgy:coke','kubejs:sodium_tungstate']).superheated().id('requiem:mixing/tungsten_with_coke')
    event.recipes.create.mixing(['kubejs:scheelite','2x kubejs:sodium_hydroxide'], ['kubejs:sodium_tungstate', 'kubejs:lime', Fluid.of('minecraft:water', 500)]).id('requiem:mixing/scheelite')
    event.recipes.create.mixing(['kubejs:scheelite', Fluid.of('kubejs:sodium_hydroxide', 500)], ['kubejs:sodium_tungstate', 'kubejs:lime', Fluid.of('minecraft:water',1000)]).id('requiem:mixing/scheelite_obtain_aqueous_naoh')
})