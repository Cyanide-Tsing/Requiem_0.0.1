ServerEvents.recipes(event=>{
    const medium = 'kubejs:assembly_universal_redstone_machinery'
    event.recipes.create.sequenced_assembly(
        'kubejs:universal_redstone_machinery',
        'minecraft:smooth_stone_slab',
        [
            event.recipes.create.deploying(medium, [medium, 'minecraft:redstone']),
            event.recipes.create.deploying(medium, [medium, 'minecraft:quartz']),
            event.recipes.create.deploying(medium, [medium, 'minecraft:redstone_torch']),
        ]
    ).transitionalItem(medium).loops(3).id('requiem:sequenced_assembly/urm')
})