ServerEvents.recipes(event=>{
    event.custom({
        "type": "createdieselgenerators:distillation",
        "ingredients": [
            {
                "fluid": "alexscaves:acid",
                "amount": 1000
            }
        ],
        "heatRequirement": "heated",
        "processingTime": 20,
        "results": [
            {
                "fluid": "kubejs:hydrofluoric_acid",
                "amount": 1000
            },
            {
                "fluid": "kubejs:radon",
                "amount": 250
            }
        ]
    }).id("kubejs:distillation/acid")
})