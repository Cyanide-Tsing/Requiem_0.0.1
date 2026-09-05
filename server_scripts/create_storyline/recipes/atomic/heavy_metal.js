ServerEvents.recipes(event=>{
    //ingot nugget block
    event.shapeless('9x kubejs:uranium_ingot', 'kubejs:pure_uranium_block').id('requiem:shapeless/uranium_ingot')
    event.shapeless('kubejs:pure_uranium_block', '9x kubejs:uranium_ingot').id('requiem:shapeless/uranium_block')
    event.shapeless('9x kubejs:thorium_ingot', 'kubejs:thorium_block').id('requiem:shapeless/thorium_ingot')
    event.shapeless('kubejs:thorium_block', '9x kubejs:thorium_ingot').id('requiem:shapeless/thorium_block')
    event.shapeless('9x kubejs:thorium_nugget', 'kubejs:thorium_ingot').id('requiem:shapeless/thorium_nugget')
    event.shapeless('kubejs:thorium_ingot', '9x kubejs:thorium_nugget').id('requiem:shapeless/thorium_ingot_from_nugget')
    event.shapeless('9x kubejs:plutonium_ingot', 'kubejs:plutonium_block').id('requiem:shapeless/plutonium_ingot')
    event.shapeless('kubejs:plutonium_block', '9x kubejs:plutonium_ingot').id('requiem:shapeless/plutonium_block')

    //smelting
    event.blasting("kubejs:plutonium_ingot", "alexscaves:fissile_core").id("requiem:blasting/plutonium_ingot")
})
ServerEvents.tags('block', event=>{
    event.add('forge:ingots/uranium', 'kubejs:uranium_ingot')
    event.add('forge:storage_blocks/uranium', 'kubejs:pure_uranium_block')
    event.add('forge:ingots/thorium', 'kubejs:thorium_ingot')
    event.add('forge:storage_blocks/thorium', 'kubejs:pure_thorium_block')
    event.add('forge:ingots/plutonium', 'kubejs:plutonium_ingot')
    event.add('forge:storage_blocks/plutonium', 'kubejs:plutonium_block')
})