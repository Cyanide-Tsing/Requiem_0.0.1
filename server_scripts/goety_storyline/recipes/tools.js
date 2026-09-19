ServerEvents.recipes(event=>{
    event.shaped(Item.of('kubejs:pale_metal_pickaxe', 1, {Enchantments:[{id:"minecraft:unbreaking", lvl:4}, {id:"minecraft:efficiency", lvl:3}, {id:"minecraft:fortune", lvl:4}]}), ['PPP', ' S ', ' S '], {P:"goety:pale_steel_ingot", S:"minecraft:stick"}).id("requiem:crafting/pale_steel_pickaxe")
})

ServerEvents.tags('item', event=>{
    event.add('minecraft:pickaxes', 'kubejs:pale_metal_pickaxe')
    event.add('forge:tools/pickaxes', 'kubejs:pale_metal_pickaxe')
})