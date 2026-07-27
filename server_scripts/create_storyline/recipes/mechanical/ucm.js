ServerEvents.recipes(event=>{
    const medium = 'kubejs:assembly_universal_copper_machinery'
    event.recipes.create.sequenced_assembly(
        'kubejs:universal_copper_machinery',
        'create:copper_sheet',
        [
            event.recipes.create.deploying(medium, [medium, 'kubejs:universal_andesite_machinery']),
            event.recipes.create.deploying(medium, [medium, 'create:electron_tube']),
            event.recipes.create.deploying(medium, [medium, 'create:brass_sheet']),
            event.recipes.vintageimprovements.curving(medium, medium).mode(2),
        ]
    ).transitionalItem(medium).loops(1).id('requiem:sequenced_assembly/ucm')
})