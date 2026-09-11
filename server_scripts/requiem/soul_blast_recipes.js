ServerEvents.recipes(event => {
    let map = {}

    event.findRecipes({ type: 'create:haunting' }).forEach(recipe => {
        global.addCreateHauntingRecipe(map, recipe.getOriginalRecipe())
    })

    event.findRecipes({ type: 'goety:cursed_infuser_recipes' }).forEach(recipe => {
        global.addCursedInfuserRecipe(map, recipe.getOriginalRecipe())
    })

    global.soulBlastRecipes = map
})
