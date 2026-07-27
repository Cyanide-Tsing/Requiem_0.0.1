ServerEvents.recipes(event=>{
    const medium = 'kubejs:assembly_universal_brass_machinery'
    event.recipes.create.sequenced_assembly(
        'kubejs:universal_brass_machinery',
        'kubejs:universal_copper_machinery',
        [
            event.recipes.create.deploying(medium, [medium, 'kubejs:universal_logistical_machinery']),
            event.recipes.create.deploying(medium, [medium, 'create:precision_mechanism']),
            event.recipes.create.deploying(medium, [medium, 'create:brass_sheet']),
            event.recipes.vintageimprovements.curving(medium, medium).mode(2),
            event.recipes.create.deploying(medium, [medium, 'create:electron_tube']),
        ]
    ).transitionalItem(medium).loops(1).id('requiem:sequenced_assembly/ubm')
})