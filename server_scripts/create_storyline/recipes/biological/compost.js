ServerEvents.recipes(event=>{
    function composting(ingredients, output, processingTime, id){
        event.custom({
            "type":"ratatouille:composting",
            "ingredients":ingredients,
            "results":output,
            "processingTime":processingTime
        }).id("requiem:composting/"+id)
    }
    //composting([{"fluid":"minecraft:milk", "amount":500}], [{"fluid":"kubejs:ammonia", "amount":100}, {"fluid":"ratatouille:bio_gas", "amount":100}], 500, "milk_rot")
    //composting([{"fluid":"minecraft:milk", "amount":500}, Item.of("kubejs:brewer_s_yeast", 1)], [Item.of("kubejs:brewer_s_yeast", 1), {"fluid":"kubejs:carbon_dioxide", "amount":200}, {"fluid":"ratatouille:bio_gas", "amount":100}], 400, "yeast_ferment")
    //composting([{"fluid":"minecraft:milk", "amount":500}, Item.of("vintagedelight:organic_mash", 1)], [Item.of("vintagedelight:organic_mash", 1), Item.of("vintagedelight:cheese_curds", 4)], 200, "cheese_curds_ferment")
    /*event.custom({
        "type":"ratatouille:composting",
        "ingredients":[
            {
                "fluid":"createdieselgenerators:ethanol",
                "amount":500
            }, 
            {
                "item":"vintagedelight:organic_mash", 
                "count":1
            }
        ],
        "results":[
            {
                "fluid":"kubejs:acetic_acid",
                "amount":500
            }, 
            {
                "item":"vintagedelight:organic_mash", 
                "count":1
            }
        ],
        "processingTime":400
    }).id("requiem:composting/vinegar_bulk_compost")*/
    //acetic acid
    //composting([{"fluid":"createdieselgenerators:ethanol", "amount":500}, Item.of("vintagedelight:organic_mash", 1)], [{"fluid":"kubejs:acetic_acid", "amount":500}, Item.of("vintagedelight:organic_mash", 1)], 400, "vinegar_ferment")
})