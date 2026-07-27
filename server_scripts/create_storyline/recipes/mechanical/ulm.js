ServerEvents.recipes(event=>{
    const medium = 'kubejs:assembly_universal_logistical_machinery'
    event.recipes.create.sequenced_assembly(
        'kubejs:universal_logistical_machinery',
        'create:iron_sheet',
        [
            event.recipes.vintageimprovements.curving(medium, medium).mode(2),
            event.recipes.create.deploying(medium, [medium, 'createdieselgenerators:chip_wood_block']),
            event.recipes.create.deploying(medium, [medium, 'create:cardboard']),
            event.recipes.create.deploying(medium, [medium, 'create:transmitter']),
            event.recipes.create.deploying(medium, [medium, 'create:iron_sheet']),
        ]
    ).transitionalItem(medium).loops(3).id('requiem:sequenced_assembly/ulm')
})