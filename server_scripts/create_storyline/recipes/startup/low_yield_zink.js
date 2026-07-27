ServerEvents.recipes(event=>{
    event.smelting(Item.of('create:zinc_nugget', 4), 'create:raw_zinc').id('create:smelting/zinc_ingot_from_raw_ore')
    event.smelting(Item.of('create:zinc_nugget', 3), '#forge:ores/zinc').id('create:smelting/zinc_ingot_from_ore')
    event.smelting(Item.of('create:zinc_nugget', 3), '#spelunkery:zinc_ores').id('spelunkery:zinc_ore_smelting')
    event.blasting(Item.of('create:zinc_nugget', 7), 'create:raw_zinc').id('create:blasting/zinc_ingot_from_raw_ore')
    event.blasting(Item.of('create:zinc_nugget', 6), '#forge:ores/zinc').id('create:blasting/zinc_ingot_from_ore')
    event.blasting(Item.of('create:zinc_nugget', 6), '#spelunkery:zinc_ores').id('spelunkery:zinc_ore_blasting')

    event.remove({id:"spelunkery:zinc_nugget_from_blasting"})
    event.remove({id:"spelunkery:zinc_nugget_from_smelting"})
})