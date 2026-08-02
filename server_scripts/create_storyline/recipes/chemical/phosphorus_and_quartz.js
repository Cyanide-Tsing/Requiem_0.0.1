ServerEvents.recipes(event=>{
    event.recipes.vintageimprovements.pressurizing(['4x minecraft:glowstone_dust', '6x kubejs:lime_powder'], ['minecraft:bone_meal', 'minecraft:bone_meal', 'minecraft:charcoal', 'minecraft:charcoal', 'minecraft:charcoal', 'minecraft:charcoal', 'minecraft:charcoal', 'minecraft:charcoal', Fluid.of('ad_astra:oxygen', 250)]).secondaryFluidInput(0).id('requiem:pressurzing/glowstone_from_bone_meal')

    event.recipes.vintageimprovements.vibrating([Item.of('minecraft:redstone').withChance(0.4), Item.of('minecraft:glowstone_dust').withChance(0.4)], 'create:cinder_flour').id("requiem:vibrating/cinder_flour")
    event.recipes.vintageimprovements.centrifugation([Item.of('minecraft:redstone'), Item.of('minecraft:redstone').withChance(0.4), Item.of('minecraft:glowstone_dust'), Item.of('minecraft:glowstone_dust').withChance(0.4)], 'create:cinder_flour').id('requiem:centrifugation/cinder_flour')
    event.recipes.vintageimprovements.pressurizing(['minecraft:glowstone_dust', 'minecraft:redstone'], ['create:cinder_flour', Fluid.of('createdieselgenerators:ethanol', 250)]).secondaryFluidInput(0).id('requiem:pressurizing/glowstone_dust_using_ethanol')
    event.recipes.vintageimprovements.pressurizing(['2x minecraft:glowstone_dust', 'minecraft:redstone'], ['create:cinder_flour', Fluid.of('createdieselgenerators:gasoline', 250)]).secondaryFluidInput(0).id('requiem:pressurizing/glowstone_dust_using_gasoline')
    event.recipes.vintageimprovements.pressurizing(['2x minecraft:glowstone_dust', 'minecraft:redstone'], ['create:cinder_flour', Fluid.of('kubejs:benzene', 250)]).secondaryFluidInput(0).id('requiem:pressurizing/glowstone_dust_using_benzene')
    event.recipes.vintageimprovements.pressurizing([Fluid.of("kubejs:n2o4", 375), Fluid.of('vintageimprovements:sulfur_trioxide', 125)], ['create:cinder_flour', Fluid.of('kubejs:nitric_acid', 750)]).secondaryFluidInput(0).id('requiem:pressurizing/glowstone_dust_using_nitric_acid')

    event.recipes.create.mixing(['create:cinder_flour'], ['2x minecraft:redstone', '2x minecraft:glowstone_dust']).id('requiem:mixing/cinder_flour')

    event.shapeless('minecraft:glowstone_dust', 'spelunkery:phosphor_fungus')

    event.remove({id:"create:rose_quartz_block_from_rose_quartz_stonecutting"})
    event.remove({id:"create:rose_quartz_tiles_from_polished_rose_quartz_stonecutting"})
    event.remove({id:"create:small_rose_quartz_tiles_from_polished_rose_quartz_stonecutting"})

    event.remove({id:"create:crafting/materials/rose_quartz_tiles_from_conversion"})
    event.remove({id:"create:crafting/materials/small_rose_quartz_tiles_from_conversion"})

    event.shapeless('9x create:rose_quartz', 'create:rose_quartz_block').id("requiem:shapeless/rose_quartz_from_block")
    event.shapeless('create:rose_quartz_block', '9x create:rose_quartz').id("requiem:shapeless/rose_quartz_block")

    event.shapeless('4x create:polished_rose_quartz', 'create:small_rose_quartz_tiles').id("requiem:shapeless/rose_quartz_from_small_tiles")
    event.shapeless('create:small_rose_quartz_tiles', '4x create:polished_rose_quartz').id("requiem:shapeless/small_rose_quartz_tiles")

    event.shapeless('9x create:polished_rose_quartz', 'create:rose_quartz_tiles').id("requiem:shapeless/rose_quartz_from_tiles")
    event.shapeless('create:rose_quartz_tiles', '9x create:polished_rose_quartz').id("requiem:shapeless/rose_quartz_tiles")

    event.remove({id:"create:crafting/materials/rose_quartz"})
    event.remove({id:"spelunkery:rose_quartz"})

    event.recipes.create.mixing("create:rose_quartz", ["kubejs:silicon", "4x minecraft:redstone"]).heated().id("create:mixing/rose_quartz")
    event.recipes.vintageimprovements.pressurizing(["create:rose_quartz"], ["kubejs:silicon", "minecraft:redstone"]).heated().id("requiem:pressurizing/rose_quartz")

    event.recipes.create.mixing("kubejs:glistening_quartz", ["kubejs:silicon", "4x minecraft:glowstone_dust"]).heated().id("requiem:mixing/glitening_quartz")
    event.recipes.vintageimprovements.pressurizing(["kubejs:glistening_quartz"], ["kubejs:silicon", "minecraft:glowstone_dust"]).heated().id("requiem:pressurizing/glistening_quartz")

    event.remove({id:"createmetallurgy:crafting/content/mechanical_belt_grinder"})
    event.remove({id:"createmetallurgy:crafting/materials/sandpaper_belt"})
    event.remove({id:"vintageimprovements:grinder_polishing/rose_quartz"})

    event.recipes.create.sandpaper_polishing('kubejs:polished_glistening_quartz', 'kubejs:glistening_quartz').id("requiem:sandpaper_polishing/glistening_quartz")

    event.recipes.vintageimprovements.laser_cutting('2x kubejs:polished_glistening_quartz', 'kubejs:glistening_quartz').energyCost(4000).id("requiem:laser_cutting/polished_glistening_quartz")
    event.recipes.vintageimprovements.laser_cutting('2x create:polished_rose_quartz', 'create:rose_quartz').energyCost(4000).id("requiem:laser_cutting/polished_rose_quartz")
})