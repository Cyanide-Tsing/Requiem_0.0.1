ServerEvents.recipes(event=>{
    event.remove({id:'create:haunting/soul_campfire'})
    event.shaped('minecraft:soul_campfire', [' S ', 'SFS', 'LLL'], {S:'minecraft:stick', F:'requiem:soul_fragment', L:'#minecraft:logs'}).id('minecraft:soul_campfire')
    event.shaped('4x minecraft:soul_torch', ['F  ', 'S  ', '   '], {S:'minecraft:stick', F:'requiem:soul_fragment'}).id('minecraft:soul_torch')

    event.replaceInput({id:"goety:totem_of_souls"}, 'minecraft:soul_lantern', 'requiem:soul_fragment')
    event.replaceInput({id:"goety:totem_of_roots"}, 'goety:ectoplasm', 'requiem:soul_fragment')
    event.replaceInput({id:"goety:totem_replenish"}, 'minecraft:soul_lantern', 'requiem:soul_fragment')

    event.recipes.goety.ritual('requiem:soulmeter', 'goety:craft', ['goety:cursed_ingot','goety:cursed_ingot','goety:cursed_ingot','goety:cursed_ingot'])
        .craftType('forge')
        .activationItem('requiem:soul_fragment')
        .duration(10)
        .soulCost(10)
        .id("requiem:rituals/forge/soulmeter")
    
    event.shaped('requiem:soulmeter', [' L ', 'LFL', ' L '], {L:'kubejs:lead_ingot', F:'requiem:soul_fragment'}).id('requiem:soulmeter')
})