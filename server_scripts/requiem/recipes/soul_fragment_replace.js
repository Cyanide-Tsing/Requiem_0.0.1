ServerEvents.recipes(event=>{
    event.remove({id:'create:haunting/soul_campfire'})
    event.shaped('minecraft:soul_campfire', [' S ', 'SFS', 'LLL'], {S:'minecraft:stick', F:'requiem:soul_fragment', L:'#minecraft:logs'}).id('minecraft:soul_campfire')
})