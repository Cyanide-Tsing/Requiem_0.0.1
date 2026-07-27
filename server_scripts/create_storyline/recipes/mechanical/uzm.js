ServerEvents.recipes(event=>{
    const medium = 'kubejs:assembly_universal_zinc_machinery'
    event.recipes.create.sequenced_assembly(
        'kubejs:universal_zinc_machinery',
        'createdeco:zinc_sheet',
        [
            event.recipes.vintageimprovements.curving(medium, medium).mode(2),
            event.recipes.create.deploying(medium, [medium, 'kubejs:universal_andesite_machinery']),
            event.recipes.create.deploying(medium, [medium, 'kubejs:insulated_copper_coil']),
            event.recipes.create.deploying(medium, [medium, 'powergrid:magnet']),
            event.recipes.create.deploying(medium, [medium, 'powergrid:resistive_coil']),
        ]
    ).transitionalItem(medium).loops(4).id('requiem:sequenced_assembly/uzm')
})