ServerEvents.recipes(event=>{
    //grinding corundum
    event.recipes.create.crushing([Item.of('kubejs:corundum_powder', 7), Item.of('kubejs:corundum_powder', 1).withChance(0.75)], "#quark:corundum").processingTime(10*100).id("requiem:crushing/corundum");
    event.recipes.create.crushing([Item.of('kubejs:corundum_powder', 2), Item.of('kubejs:corundum_powder', 1).withChance(0.75)], "#requiem:corundum_clusters").processingTime(5*100).id("requiem:crushing/corundum_cluster");
    event.recipes.create.crushing([Item.of('kubejs:corundum_powder', 2), Item.of('kubejs:corundum_powder', 1).withChance(0.75)], "iceandfire:sapphire_gem").processingTime(5*100).id("requiem:crushing/sapphire");
    event.recipes.create.crushing([Item.of('kubejs:corundum_powder', 1), Item.of('kubejs:corundum_powder', 1).withChance(0.75), Item.of('kubejs:chromia', 1).withChance(0.02)], "minecraft:emerald").processingTime(5*100).id("requiem:crushing/emerald");
    //pressurizing
    event.custom({
        "type":"vintageimprovements:pressurizing",
        "heatRequirement": "heated",
        "ingredients": [ 
            {
                "item": "kubejs:sodium_hydroxide",
                "count": 1
            },
            {
                "item": "quark:red_corundum_cluster",
                "count": 1
            }
        ],
        "results": [
            {
                "item": "kubejs:sodium_hydroxide",
                "count": 1
            },
            {
                "item": "kubejs:corundum_powder",
                "count": 2
            }
            ,
            {
                "item": "kubejs:chromia",
                "count": 1
            }
        ],
        "processingTime": 100
    }).id("requiem:pressurizing/chromia")

    event.custom({
        "type":"vintageimprovements:pressurizing",
        "heatRequirement": "heated",
        "ingredients": [ 
            {
                "item": "kubejs:sodium_hydroxide",
                "count": 1
            },
            {
                "item": "quark:red_corundum",
                "count": 1
            }
        ],
        "results": [
            {
                "item": "kubejs:sodium_hydroxide",
                "count": 1
            },
            {
                "item": "kubejs:corundum_powder",
                "count": 7
            }
            ,
            {
                "item": "kubejs:chromia",
                "count": 1
            }
        ],
        "processingTime": 600
    }).id("requiem:pressurizing/chromia_from_chunks_of_corundum")

    event.custom({
        "type":"vintageimprovements:pressurizing",
        "heatRequirement": "heated",
        "ingredients": [ 
            {
                "item": "kubejs:sodium_hydroxide",
                "count": 1
            },
            {
                "item": "iceandfire:sapphire_gem",
                "count": 1
            }
        ],
        "results": [
            {
                "item": "kubejs:sodium_hydroxide",
                "count": 1
            },
            {
                "item": "kubejs:corundum_powder",
                "count": 3
            }
        ],
        "processingTime": 100
    }).id("requiem:pressurizing/corundum_powder")

    event.custom({
        "type":"vintageimprovements:pressurizing",
        "heatRequirement": "heated",
        "ingredients": [ 
            {
                "item": "kubejs:sodium_hydroxide",
                "count": 1
            },
            {
                "item": "goety:soul_ruby",
                "count": 1
            }
        ],
        "results": [
            {
                "item": "kubejs:sodium_hydroxide",
                "count": 1
            },
            {
                "item": "kubejs:corundum_powder",
                "count": 2
            }
            ,
            {
                "item": "kubejs:chromia",
                "count": 2
            }
        ],
        "processingTime": 100
    }).id("requiem:pressurizing/chromia_from_soul_ruby")
    //producing corundum
    const minorElements = {'red':'kubejs:chromia', 'orange':'kubejs:soda_powder', 'yellow':'kubejs:lime_powder', 'blue':'create:zinc_nugget', 'indigo':'create:copper_nugget', 'violet':'minecraft:iron_nugget', 'black':'iceandfire:silver_nugget'}
    for(let [color, compound] of Object.entries(minorElements)){
        event.shaped(Item.of('quark:'+color+'_corundum', 1), ['AAA', 'ACA', 'AAA'], {A:'kubejs:corundum_powder', C:compound}).id('requiem:crafting/'+color+'corundum')
        event.shaped(Item.of('quark:'+color+'_corundum_cluster', 1), [' A ', 'ACA', '   '], {A:'kubejs:corundum_powder', C:compound}).id('requiem:crafting/'+color+'corundum_cluster')
    }

    //synthesizing_ruby
    event.custom({
        "type":"vintageimprovements:vacuumizing",
        "heatRequirement": "superheated",
        "ingredients": [ 
            {
                "item": "kubejs:corundum_powder",
                "count": 1
            },
            {
                "item": "kubejs:corundum_powder",
                "count": 1
            },
            {
                "item": "kubejs:corundum_powder",
                "count": 1
            },
            {
                "item": "kubejs:corundum_powder",
                "count": 1
            },
            {
                "item": "kubejs:chromia",
                "count": 1
            }
        ],
        "results": [
            {
                "item": "kubejs:synthetic_ruby",
                "count": 1
            }
        ],
        "processingTime": 1000
    }).id("requiem:vacuumizing/synthetic_ruby")

    event.custom({
        "type":"vintageimprovements:vacuumizing",
        "heatRequirement": "superheated",
        "ingredients": [ 
            {
                "item": "kubejs:corundum_powder",
                "count": 1
            },
            {
                "item": "kubejs:corundum_powder",
                "count": 1
            },
            {
                "item": "kubejs:corundum_powder",
                "count": 1
            },
            {
                "item": "kubejs:corundum_powder",
                "count": 1
            },
            {
                "item": "kubejs:corundum_powder",
                "count": 1
            },
            {
                "item": "kubejs:corundum_powder",
                "count": 1
            }
        ],
        "results": [
            {
                "item": "iceandfire:sapphire_gem",
                "count": 2
            }
        ],
        "processingTime": 1000
    }).id("requiem:vacuumizing/synthetic_sapphire")

    event.shapeless('iceandfire:summoning_crystal_fire', ['iceandfire:fire_dragon_blood', 'minecraft:ender_pearl', 'minecraft:diamond', 'kubejs:synthetic_ruby']).id('requiem:summoning_crystal_from_ruby')
    event.shaped('artifacts:panic_necklace', [' SS', 'S S', 'RS '], {R:'kubejs:synthetic_ruby', S:'minecraft:string'}).id('requiem:panic_crystal')
    //event.shapeless('grindstone_honing:minigrindstone', ['minecraft:grindstone', 'kubejs:synthetic_ruby']).id('grindstone_honing:minigrindstone')
    event.shaped('fossil:scarab_gem', ['GGG', ' R ', 'G G'], {G:'minecraft:gold_nugget', R:'#forge:gems/ruby'}).replaceIngredient('kubejs:synthetic_ruby',"minecraft:air").id('requiem:crafting/scarab_gem')
    event.shaped('fossil:scarab_gem_aquatic', ['GGG', ' S ', 'G G'], {G:'minecraft:gold_nugget', S:'iceandfire:sapphire_gem'}).id('requiem:crafting/aquatic_scarab_gem')

    event.recipes.create.sandpaper_polishing(Item.of('artifacts:crystal_heart').withChance(0.75), 'kubejs:synthetic_ruby').id('requiem:sandpaper_polishing/crystal_heart')
    event.remove({id:'requiem:sandpaper_polishing/crystal_heart_using_deployer'})

    //event.shaped('grindstone_honing:minigrindstone', [' B ', 'BAB', ' B '], {A:'minecraft:grindstone', B:'kubejs:corundum_powder'}).id('grindstone_honing:minigrindstone_alt')
    event.shapeless('4x createbigcannons:casting_sand', ['4x minecraft:sand','kubejs:corundum_powder', 'kubejs:magnesia', 'kubejs:lime']).id('requiem:shapeless/casting_sand')
})

ServerEvents.tags('item', (event)=>{
    event.add('requiem:corundum_clusters', 'quark:red_corundum_cluster'), //Cr
    event.add('requiem:corundum_clusters', 'quark:orange_corundum_cluster'), //Na
    event.add('requiem:corundum_clusters', 'quark:yellow_corundum_cluster'), //Ca
    event.add('requiem:corundum_clusters', 'quark:blue_corundum_cluster'), //Zn
    event.add('requiem:corundum_clusters', 'quark:indigo_corundum_cluster'), //Cu
    event.add('requiem:corundum_clusters', 'quark:violet_corundum_cluster'), //Fe
    event.add('requiem:corundum_clusters', 'quark:white_corundum_cluster'), //Nope
    event.add('requiem:corundum_clusters', 'quark:black_corundum_cluster'), //Ag

    event.add('requiem:ruby', 'goety:soul_ruby'),
    event.add('requiem:ruby', 'kubejs:synthetic_ruby'),

    event.add('forge:gems/ruby', 'goety:soul_ruby'),
    event.add('forge:gems/ruby', 'kubejs:synthetic_ruby')

    event.add('forge:salt', 'ratatouille:salt')
    event.add('forge:dusts/salt', 'ratatouille:salt')
})