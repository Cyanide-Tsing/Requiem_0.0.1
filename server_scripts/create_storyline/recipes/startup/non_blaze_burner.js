ServerEvents.recipes(event=>{
    event.shaped(Item.of('createdieselgenerators:burner', 1), [' F ', ' V ', ' E '], {F:'minecraft:flint_and_steel', V:'create:fluid_valve', E:'create:empty_blaze_burner'}).id('createdieselgenerators:crafting/burner')
})