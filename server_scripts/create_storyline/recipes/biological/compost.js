ServerEvents.recipes(event=>{
    function composting(ingredients, output, processingTime){
        event.custom({
            "type":"ratatouille:composting",
            "ingredients":ingredients,
            "results":output,
            "processingTime":processingTime
        }).id("requiem:composting/"+ingredients[0].toString().split(":")[1])
    }
    
})