ServerEvents.recipes(event=>{
    //Helium
    event.recipes.vintageimprovements.vacuumizing(['minecraft:ice', Fluid.of('kubejs:ammonia',10)], [Fluid.of('minecraft:water'), Fluid.of('kubejs:ammonia',10)]).secondaryFluidInput(1).secondaryFluidOutput(0).id('requiem:vacuumizing/ice')
    event.recipes.vintageimprovements.vacuumizing(['minecraft:ice', 'blue_ice'], [Fluid.of('minecraft:water'), 'blue_ice']).id('requiem:vacuumizing/ice_using_blue_ice')
    event.recipes.vintageimprovements.vacuumizing([Fluid.of('minecraft:water'), Fluid.of('kubejs:helium', 100)],'kubejs:porous_ice').secondaryFluidOutput(1).id('requiem:vacuumizing/helium')

    event.recipes.create.emptying([Fluid.of('kubejs:helium', 50), 'kubejs:rubber'], Item.of('artifacts:helium_flamingo')).id('requiem:emptying/helium_flamingo')
})