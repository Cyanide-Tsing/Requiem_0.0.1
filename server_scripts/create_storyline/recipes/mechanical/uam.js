ServerEvents.recipes(event=>{
    const medium = 'kubejs:assembly_universal_andesite_machinery'
    event.recipes.create.sequenced_assembly(
        'kubejs:universal_andesite_machinery',
        'createdeco:andesite_sheet',
        [
            event.recipes.vintageimprovements.curving(medium, medium).mode(1),
            event.recipes.create.deploying(medium, [medium, 'createdieselgenerators:chip_wood_block']),
            event.recipes.create.deploying(medium, [medium, 'createdeco:andesite_sheet'])
        ]
    ).transitionalItem(medium).loops(3).id('requiem:sequenced_assembly/uam')
})