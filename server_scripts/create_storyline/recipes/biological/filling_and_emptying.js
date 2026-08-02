ServerEvents.recipes(event=>{
    //filling and emptying acetic acid
    event.recipes.create.emptying([Fluid.of("kubejs:acetic_acid", 250), "minecraft:glass_bottle"], ["vintagedelight:vinegar_bottle"]).id("requiem:emptying/vinegar_bottle")
    event.recipes.create.emptying([Fluid.of("kubejs:acetic_acid", 750), "vintagedelight:mason_jar"], ["vintagedelight:vinegar_mason_jar"]).id("requiem:emptying/vinegar_jar")
    event.recipes.create.filling(["vintagedelight:vinegar_mason_jar"], [Fluid.of("kubejs:acetic_acid", 750), "vintagedelight:mason_jar"]).id("requiem:filling/mason_jar_vinegar")
    event.recipes.create.filling(["vintagedelight:vinegar_bottle"], [Fluid.of("kubejs:acetic_acid", 250), "minecraft:glass_bottle"]).id("requiem:filling/bottle_vinegar")
})