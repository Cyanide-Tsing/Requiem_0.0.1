ServerEvents.recipes(event=>{
    //milk processing
    event.custom({
        "type": "createdieselgenerators:basin_fermenting",
        "ingredients": [
            {
                "fluid": "minecraft:milk",
                "amount": 500
            },
            {
                "item": "kubejs:brewer_s_yeast"
            }
        ],
        "processingTime": 400,
        "results": [
            {
                "fluid": "kubejs:carbon_dioxide",
                "amount": 200
            },
            {
                "fluid": "ratatouille:bio_gas",
                "amount": 100
            },
            {
                "item": "kubejs:brewer_s_yeast"
            }
        ]
    }).id('requiem:basin_fermenting/milk_to_CO2_and_H2S')

    event.custom({
        "type": "createdieselgenerators:bulk_fermenting",
        "ingredients": [
            {
                "fluid": "minecraft:milk",
                "amount": 500
            },
            {
                "item": "kubejs:brewer_s_yeast"
            }
        ],
        "processingTime": 200,
        "results": [
            {
                "fluid": "kubejs:carbon_dioxide",
                "amount": 200
            },
            {
                "fluid": "ratatouille:bio_gas",
                "amount": 100
            },
            {
                "item": "kubejs:brewer_s_yeast"
            }
        ]
    }).id('requiem:bulk_fermenting/milk_to_CO2_and_H2S')
})