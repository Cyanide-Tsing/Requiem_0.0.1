ServerEvents.recipes(event=>{
    function composting(ingredients, output, processingTime, id){
        event.custom({
            "type":"ratatouille:composting",
            "ingredients":ingredients,
            "results":output,
            "processingTime":processingTime
        }).id("requiem:composting/"+id)
    }
    composting([{"fluid":"minecraft:milk", "amount":500}], [{"fluid":"kubejs:ammonia", "amount":100}, {"fluid":"ratatouille:bio_gas", "amount":100}], 4000, "milk_rot")
    composting([{"fluid":"minecraft:milk", "amount":500}, Item.of("kubejs:brewer_s_yeast", 1)], [Item.of("kubejs:brewer_s_yeast", 1), {"fluid":"kubejs:carbon_dioxide", "amount":200}, {"fluid":"ratatouille:bio_gas", "amount":100}], 400, "yeast_ferment")
    composting([{"fluid":"minecraft:milk", "amount":500}, Item.of("vintagedelight:organic_mash", 1)], [Item.of("vintagedelight:organic_mash", 1), Item.of("vintagedelight:cheese_curds", 4)], 200, "cheese_curds_ferment")

    //acetic acid
    composting([{"fluid":"createdieselgenerators:ethanol", "amount":500}, Item.of("vintagedelight:organic_mash", 1)], [{"fluid":"kubejs:acetic_acid", "amount":500}, Item.of("vintagedelight:organic_mash", 1)], 400, "vinegar_ferment")
    event.recipes.create.emptying([Fluid.of("kubejs:acetic_acid", 250), "minecraft:glass_bottle"], ["vintagedelight:vinegar_bottle"]).id("requiem:emptying/vinegar_bottle")
    event.recipes.create.emptying([Fluid.of("kubejs:acetic_acid", 750), "vintagedelight:mason_jar"], ["vintagedelight:vinegar_mason_jar"]).id("requiem:emptying/vinegar_jar")
})