global.cyclotronRecipes = []

global.addCyclotronRecipe = (ingredient, result, minSpeed) => {
    global.cyclotronRecipes.push({
        ingredient: Ingredient.of(ingredient),
        result: Item.of(result),
        minSpeed: minSpeed || 0
    })
}

global.findCyclotronResult = (level, block, speed) => {
    for (let r of global.cyclotronRecipes) {
        if (speed >= r.minSpeed && r.ingredient.test(Item.of(block.id))) {
            return r.result
        }
    }
    return null
}
