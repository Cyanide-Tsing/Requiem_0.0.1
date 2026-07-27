ServerEvents.recipes(event=>{
    const medium = 'kubejs:assembly_universal_sturdy_machinery'
    event.recipes.create.sequenced_assembly(
        'kubejs:universal_sturdy_machinery',
        'createbigcannons:cast_iron_block',
        [
            event.recipes.vintageimprovements.curving(medium, medium).mode(1),
            event.recipes.create.deploying(medium, [medium, 'vintageimprovements:cast_iron_sheet']),
            event.recipes.create.deploying(medium, [medium, 'createmetallurgy:refractory_mortar_ball']),
        ]
    ).transitionalItem(medium).loops(1).id('requiem:sequenced_assembly/usm')
})