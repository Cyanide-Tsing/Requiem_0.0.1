ServerEvents.recipes(event=>{
    //获取酵母
    event.shapeless('farmersdelight:tree_bark', '#immersive_weathering:bark').id('requiem:crafting/tree_bark')

    event.custom({
        "type": "createdieselgenerators:basin_fermenting",
        "ingredients": [
            {
                "tag": "forge:dough/wheat"
            },
            {
                "item": "farmersdelight:tree_bark"
            }
        ],
        "processingTime": 200,
        "results": [
            {
                "item": "kubejs:brewer_s_yeast",
                "chance": 0.5
            }
        ]
    }).id('requiem:basin_fermenting/brewer_s_yeast')

    event.custom({
        "type": "createdieselgenerators:basin_fermenting",
        "ingredients": [
            {
                "tag": "forge:dough/wheat"
            },
            {
                "item": "kubejs:brewer_s_yeast"
            }
        ],
        "processingTime": 200,
        "results": [
            {
                "item": "kubejs:brewer_s_yeast",
                "count": 3
            }
        ]
    }).id('requiem:basin_fermenting/brewer_s_yeast_multiplication')

    //大量产糖
    event.custom({
        "type":"vintageimprovements:pressurizing",
        "ingredients": [ 
            {
                "item": "create:wheat_flour"
            },
            {
                "fluid": "vintageimprovements:sulfuric_acid",
                "amount": 500
            }
        ],
        "results": [
            {
                "item": "minecraft:sugar",
                "count": 2
            },
            {
                "fluid": "vintageimprovements:sulfuric_acid",
                "amount": 500
            }
        ],
        "processingTime": 300
    }).id('requiem:pressurizing/sugar')

    event.custom({
        "type":"vintageimprovements:pressurizing",
        "heatRequirement":"heated",
        "ingredients": [ 
            {
                "item": "create:wheat_flour"
            },
            {
                "fluid": "kubejs:hydrochloric_acid",
                "amount": 500
            }
        ],
        "results": [
            {
                "item": "minecraft:sugar",
                "count": 3
            },
            {
                "item": "minecraft:sugar",
                "count": 3,
                "chance": 0.25
            }
        ],
        "processingTime": 100
    }).id('requiem:pressurizing/sugar_heated')

    //大规模生产乙醇
    event.custom({
        "type": "createdieselgenerators:basin_fermenting",
        "ingredients": [
            {
                "tag": "createdieselgenerators:fermentable"
            },
            {
                "item": "kubejs:brewer_s_yeast"
            }
        ],
        "processingTime": 400,
        "results": [
            {
                "fluid": "createdieselgenerators:ethanol",
                "amount": 250
            },
            {
                "item": "kubejs:brewer_s_yeast"
            }
        ]
    }).id('createdieselgenerators:basin_fermenting/fermentable')

    event.custom({
        "type": "createdieselgenerators:bulk_fermenting",
        "ingredients": [
            {
                "tag": "createdieselgenerators:fermentable"
            },
            {
                "item": "kubejs:brewer_s_yeast"
            }
        ],
        "processingTime": 200,
        "results": [
            {
                "fluid": "createdieselgenerators:ethanol",
                "amount": 250
            },
            {
                "item": "kubejs:brewer_s_yeast"
            }
        ]
    }).id('createdieselgenerators:bulk_fermenting/fermentable')

    event.custom({
        "type": "createdieselgenerators:basin_fermenting",
        "ingredients": [
            {
                "item": "minecraft:sugar"
            },
            {
                "item": "kubejs:brewer_s_yeast"
            }
        ],
        "processingTime": 200,
        "results": [
            {
                "fluid": "createdieselgenerators:ethanol",
                "amount": 500
            },
            {
                "item": "kubejs:brewer_s_yeast"
            }
        ]
    }).id('requiem:basin_fermenting/ethanol')

    event.custom({
        "type": "createdieselgenerators:bulk_fermenting",
        "ingredients": [
            {
                "item": "minecraft:sugar"
            },
            {
                "item": "kubejs:brewer_s_yeast"
            }
        ],
        "processingTime": 100,
        "results": [
            {
                "fluid": "createdieselgenerators:ethanol",
                "amount": 500
            },
            {
                "item": "kubejs:brewer_s_yeast"
            }
        ]
    }).id('requiem:bulk_fermenting/ethanol')

    //mass prod of acetic acid
    event.custom({
        "type": "createdieselgenerators:basin_fermenting",
        "ingredients": [
            {
                "fluid": "createdieselgenerators:ethanol",
                "amount": 500
            },
            {
                "item": "vintagedelight:organic_mash"
            }
        ],
        "processingTime": 400,
        "results": [
            {
                "fluid": "kubejs:acetic_acid",
                "amount": 500
            },
            {
                "item": "vintagedelight:organic_mash"
            }
        ]
    }).id('requiem:basin_fermenting/acetic_acid')

    event.custom({
        "type": "createdieselgenerators:bulk_fermenting",
        "ingredients": [
            {
                "fluid": "createdieselgenerators:ethanol",
                "amount": 500
            },
            {
                "item": "vintagedelight:organic_mash"
            }
        ],
        "processingTime": 200,
        "results": [
            {
                "fluid": "kubejs:acetic_acid",
                "amount": 500
            },
            {
                "item": "vintagedelight:organic_mash"
            }
        ]
    }).id('requiem:bulk_fermenting/acetic_acid')
})

ServerEvents.tags('item', event=>{
    event.remove('createdieselgenerators:fermentable', 'minecraft:sugar')
})