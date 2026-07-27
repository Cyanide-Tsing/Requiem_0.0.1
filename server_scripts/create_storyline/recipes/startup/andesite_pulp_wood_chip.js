ServerEvents.recipes(event=>{
    //基础工具：锤子与剪线钳
    event.remove({id:'createdieselgenerators:crafting/hammer'})
    event.remove({id:'createdieselgenerators:crafting/wire_cutters'})

    event.shaped(Item.of('createdieselgenerators:hammer'), [' IN',' SI','S  '], {I:'minecraft:iron_ingot', N:'minecraft:iron_nugget', S:'minecraft:stick'}).id("requiem:crafting/hammer")
    event.shaped(Item.of('createdieselgenerators:wire_cutters'), [' H ', 'SNH', ' S '], {H:'create:iron_sheet', N:'minecraft:iron_nugget', S:'minecraft:stick'}).id("requiem:crafting/wire_cutters")

    //使用矿物合成安山粉末
    event.shapeless(Item.of('kubejs:powdered_andesite', 3), [Item.of("minecraft:quartz", 1), Item.of("kubejs:corundum_powder", 2)]).id('requiem:crafting/powdered_andesite')
    
    //安山岩循环产线
    event.remove({id:'create:milling/andesite'})
    event.recipes.create.milling([Item.of('kubejs:powdered_andesite', 3), Item.of('kubejs:powdered_andesite', 1).withChance(0.75)], Item.of('minecraft:andesite')).id("requiem:milling/andesite")
    event.recipes.create.compacting(Item.of('andesite', 1).withChance(0.5), [Item.of("kubejs:powdered_andesite", 1), Fluid.of("minecraft:lava", 50)]).id("requiem:compacting/andesite")

    //简单的磨制安山岩配方
    event.recipes.create.sandpaper_polishing('minecraft:polished_andesite', 'minecraft:andesite').id('create:sandpaper_polishing/polished_andesite')
    //简单的砂纸
    event.shapeless('create:sand_paper', ['minecraft:paper', 'kubejs:powdered_andesite']).id('requiem:crafting/convenient_sand_paper')
    
    //安山合金增产
    event.shaped(Item.of("create:andesite_alloy"), ['NA ','   ','   '], {A:"kubejs:powdered_andesite", N:'minecraft:iron_nugget'}).id("create:crafting/materials/andesite_alloy")
    event.shaped(Item.of("create:andesite_alloy"), ['NA ','   ','   '], {A:"kubejs:powdered_andesite", N:'create:zinc_nugget'}).id("create:crafting/materials/andesite_alloy_from_zinc")
    event.recipes.create.mixing(Item.of('create:andesite_alloy', 2), ['kubejs:powdered_andesite', 'minecraft:iron_nugget']).id('create:mixing/andesite_alloy')
    event.recipes.create.mixing(Item.of('create:andesite_alloy', 18), ['9x kubejs:powdered_andesite', 'minecraft:iron_ingot']).id('create:mixing/andesite_alloy_alt')
    event.recipes.create.compacting(Item.of('create:andesite_alloy_block', 2), ['9x kubejs:powdered_andesite', Fluid.of("createmetallurgy:molten_iron", 90)]).id('create:compacting/andesite_alloy_from_molten_iron')

    //木屑的获取
    event.custom({
        "type": "createdieselgenerators:wire_cutting",
        "ingredients": [
            {
                "item": "minecraft:stick"
            }
        ],
        "results": [
            {
                "item": "createdieselgenerators:wood_chip",
                "count": 1
            }
        ]
    }).id('requiem:wire_cutting/wood_chip')

    //纸浆
    event.shapeless(Item.of("create:pulp", 1), [Item.of('minecraft:water_bucket', 1), Item.of('createdieselgenerators:wood_chip', 8)]).replaceIngredient('minecraft:water_bucket', 'minecraft:bucket').id('requiem:crafting/pulp')
    event.recipes.create.mixing([Item.of('create:pulp', 1), Item.of('create:pulp', 1).withChance(0.50)], ['8x #create:pulpifiable', Fluid.of('minecraft:water', 250)]).id('create:mixing/cardboard_pulp')
    event.custom({
    "type": "createdieselgenerators:bulk_fermenting",
    "ingredients": [
        {
            "tag": "create:pulpifiable"
        },
        {
            "tag": "create:pulpifiable"
        },
        {
            "tag": "create:pulpifiable"
        },
        {
            "tag": "create:pulpifiable"
        },
        {
            "tag": "create:pulpifiable"
        },
        {
            "tag": "create:pulpifiable"
        },
        {
            "tag": "create:pulpifiable"
        },
        {
            "tag": "create:pulpifiable"
        },
        {
            "fluid": "minecraft:water",
            "amount": 250
        }
    ],
    "processingTime": 400,
    "results": [
        {
            "item": "create:pulp"
        },
        {
            "item": "create:pulp",
            "chance": 0.75
        }
    ]
    }).id("createdieselgenerators:bulk_fermenting/pulp")

    event.custom({
    "type": "createdieselgenerators:bulk_fermenting",
    "ingredients": [
        {
            "tag": "create:pulpifiable"
        },
        {
            "tag": "create:pulpifiable"
        },
        {
            "tag": "create:pulpifiable"
        },
        {
            "tag": "create:pulpifiable"
        },
        {
            "fluid": "kubejs:sodium_hydroxide",
            "amount": 250
        }
    ],
    "processingTime": 400,
    "results": [
        {
            "item": "create:pulp"
        },
        {
            "item": "create:pulp",
            "chance": 0.75
        }
    ]
    }).id("createdieselgenerators:bulk_fermenting/pulp_using_caustic_soda")
    
    event.recipes.create.mixing([Item.of('create:pulp', 1), Item.of('create:pulp', 1).withChance(0.50)], ['8x createdieselgenerators:wood_chip', Fluid.of('minecraft:water', 250)]).id('create:mixing/pulp')
    event.custom({
        "type":"vintageimprovements:pressurizing",
        "secondaryFluidInput": 1,
        "heatRequirement": "heated",
        "ingredients": [
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "fluid": "minecraft:water",
                "amount": 250
            },
            {
                "fluidTag": "forge:sulfur_dioxide",
                "amount": 250
            }
        ],
        "results": [
            {
                "item": "create:pulp",
                "count": 4
            }
        ],
        "processingTime": 100
    }).id("requiem:pressurizing/pulp_using_sulfur_dioxide")

    event.custom({
        "type":"vintageimprovements:pressurizing",
        "secondaryFluidInput": 1,
        "heatRequirement": "heated",
        "ingredients": [
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "createdieselgenerators:wood_chip",
            },
            {
                "item": "kubejs:sodium_hydroxide",
                "count": 1
            },
            {
                "fluid": "minecraft:water",
                "amount": 250
            }
        ],
        "results": [
            {
                "item": "create:pulp",
                "count": 4
            },
            {
                "fluid": "kubejs:sodium_hydroxide",
                "amount": 250
            }
        ],
        "processingTime": 100
    }).id("requiem:pressurizing/pulp_using_caustic_soda")
    
    //纸浆制作纸
    event.custom({
        "type":"createaddition:rolling",
        "input": {
            "item": "create:pulp"
        },
        "result": {
            "item": "minecraft:paper",
            "count": 4
        }
    }).id('requiem:rolling/paper_from_pulp')

    //木屑
    event.shapeless(Item.of("createdieselgenerators:wood_chip", 4), Item.of("createdieselgenerators:chip_wood_block", 1)).id('requiem:crafting/wood_chips')
    event.stonecutting(Item.of("createdieselgenerators:chip_wood_beam",1), Item.of("createdieselgenerators:chip_wood_block", 1)).id('requiem:stonecutting/chip_wood_beam')
    event.recipes.create.milling([Item.of("createdieselgenerators:wood_chip", 4), Item.of("createdieselgenerators:wood_chip", 2).withChance(0.75)], Item.of("createdieselgenerators:chip_wood_beam", 1)).id('requiem:milling/chip_wood_from_beam')
    event.recipes.create.milling([Item.of("createdieselgenerators:wood_chip", 4), Item.of("createdieselgenerators:wood_chip", 2).withChance(0.75)], Item.of("createdieselgenerators:chip_wood_block", 1)).id('requiem:milling/chip_wood_from_block')
    event.custom({
        "type": "create:crushing",
        "ingredients": [
            {
                "type": "forge:difference",
                "base": [
                    {
                        "tag": "minecraft:wooden_slabs"
                    },
                    {
                        "item": "minecraft:bamboo_mosaic_slab"
                    }
                ],
                "subtracted": {
                    "item": "createdieselgenerators:chip_wood_slab"
                }
            }
        ],
        "results": [
            {
                "item": "createdieselgenerators:wood_chip",
                "count": 3
            },
            {
                "item": "createdieselgenerators:wood_chip",
                "chance": 0.5
            }
        ]
    }).id("createdieselgenerators:crushing/wood_chip_slabs")
})

BlockEvents.rightClicked(event=>{
    if(event.player.mainHandItem.id === 'createdieselgenerators:hammer' && event.player.mainHandItem.damageValue < 128){
        if(!event.player.isCreative())event.player.mainHandItem.damageValue++;
        if(event.block.id === 'minecraft:polished_andesite') event.block.set('create:millstone');
        if(event.block.id === 'minecraft:andesite'){
            if(Math.random()<0.25) event.block.set('minecraft:stone');
            event.block.popItem('kubejs:powdered_andesite')
        }
    }
})

ServerEvents.tags('item', event=>{
    event.add('create:pulpifiable', '#immersive_weathering:bark');
    event.add('create:pulpifiable', 'farmersdelight:tree_bark');
    event.add('forge:stripped_logs', 'createdieselgenerators:chip_wood_beam');
})