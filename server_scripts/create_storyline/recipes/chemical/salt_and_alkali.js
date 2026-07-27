ServerEvents.recipes(event=>{
    event.remove({id:'ratatouille:salt'})
    event.remove({id:'create:mixing/salt'})
    event.remove({id:'spelunkery:mixing/salt'})
    event.remove({id:'spelunkery:salt_block'})
    event.replaceOutput({output:"spelunkery:salt"}, "spelunkery:salt", "vintagedelight:salt_dust")

    //Salt self duplication
    event.shapeless("vintagedelight:salt_dust", "spelunkery:salt").id("requiem:crafting/salt_dust")
    // event.recipes.create.mixing('spelunkery:rock_salt', ["vintagedelight:salt_dust", Fluid.of("minecraft:water", 250)]).id("spelunkery:mixing/rock_salt")
    event.recipes.vintageimprovements.vacuumizing('spelunkery:rock_salt', ["vintagedelight:salt_dust", Fluid.of("minecraft:water", 125)]).id("requiem:vacuumizing/rock_salt")
    event.recipes.create.crushing([Item.of("vintagedelight:salt_dust", 2), Item.of("vintagedelight:salt_dust", 1).withChance(0.75)], 'spelunkery:rock_salt').id("spelunkery:crushing/salt")
    event.recipes.create.milling([Item.of("vintagedelight:salt_dust", 2), Item.of("vintagedelight:salt_dust", 1).withChance(0.75)], 'spelunkery:rock_salt').id("spelunkery:milling/salt")

    //Na
    event.recipes.create.mixing([Fluid.of('kubejs:brine', 250)], ['vintagedelight:salt_dust', Fluid.of('minecraft:water', 250)]).id('requiem:mixing/brine')
    event.recipes.create.mixing([Fluid.of('kubejs:brine', 250), 'ratatouille:salt'], ['vintagedelight:salt_dust', Fluid.of('kubejs:brine', 250)]).id('requiem:mixing/purify_salt')
    event.recipes.create.mixing([Fluid.of('kubejs:refined_brine', 500), 'kubejs:brucite', 'kubejs:sodium_sulphate'], ['2x kubejs:sodium_hydroxide', Fluid.of('kubejs:brine', 500)]).id('requiem:mixing/purify_brine')
    event.recipes.create.mixing([Fluid.of('kubejs:refined_brine', 250), 'kubejs:magnesite', 'kubejs:sodium_sulphate'], ['kubejs:soda_powder', Fluid.of('kubejs:brine', 250)]).id('requiem:mixing/purify_brine_carbonate')
    event.recipes.create.mixing(['ratatouille:salt'], [Fluid.of('kubejs:refined_brine', 250)]).heated().id('requiem:mixing/edible_salt')

    event.recipes.create.mixing([Fluid.of('kubejs:refined_brine', 250)], ['ratatouille:salt', Fluid.of('minecraft:water', 250)]).id('requiem:mixing/brine_regenerate')
    event.recipes.create.mixing([Fluid.of('kubejs:refined_brine', 250), Fluid.of('kubejs:carbon_dioxide', 250)], ['kubejs:soda_powder', Fluid.of('kubejs:hydrochloric_acid', 250)]).id('requiem:mixing/salt_from_carbonate')
    event.recipes.create.mixing([Fluid.of('kubejs:refined_brine', 250)], ['kubejs:sodium_hydroxide', Fluid.of('kubejs:hydrochloric_acid', 250)]).id('requiem:mixing/salt')
    
    event.shapeless('supplementaries:soap', ['kubejs:sodium_hydroxide', 'immersive_weathering:tallow']).id('supplementaries:soap')
    event.shapeless('supplementaries:soap', ['2x supplementaries:ash', 'immersive_weathering:tallow']).id('supplementaries:soap_from_ash')
    event.recipes.create.compacting('2x supplementaries:soap', [Fluid.of('kubejs:sodium_hydroxide', 500), Fluid.of('createdieselgenerators:plant_oil', 500)]).id('requiem:compacting/soap')

    event.custom({
        "type":"vintageimprovements:pressurizing",
        "secondaryFluidInput": 1,
        "heatRequirement": "heated",
        "ingredients": [ 
            {
                "fluid": "kubejs:refined_brine",
                "amount": 1000
            },
            {
                "fluid": "kubejs:ammonia",
                "amount": 500
            },
            {
                "fluid": "kubejs:carbon_dioxide",
                "amount": 500
            }
        ],
        "results": [
            {
                "item": "kubejs:soda_powder",
                "count": 2
            },
            {
                "item": "kubejs:ammonium_chloride",
                "count": 2
            }
        ],
        "processingTime": 40
    }).id("vintageimprovements:pressurizing/hou")

    /*
    event.recipes.vintageimprovements.pressurizing(
            [Item.of("kubejs:leyden_jar", 1, {energy:0}), Fluid.of("kubejs:sodium_hydroxide", 500), Fluid.of("kubejs:chlorine", 250), Fluid.of("ad_astra:hydrogen", 250)],
            [Item.of("kubejs:leyden_jar", 1, {energy:2080}).strongNBT(), Fluid.of("kubejs:refined_brine", 1000)]
        )
        .secondaryFluidOutput(2)
        .id("vintageimprovements:pressurizing/electrolyze_NaCl")
    */

    event.recipes.vintageimprovements.pressurizing(
        [Item.of("kubejs:discharged_electrolyzer"), Fluid.of("kubejs:sodium_hydroxide", 500), Fluid.of("kubejs:chlorine", 250), Fluid.of("ad_astra:hydrogen", 250)],
        [Item.of("kubejs:electrolyzer"), Fluid.of("kubejs:refined_brine", 1000)]
    )
    .secondaryFluidOutput(2)
    .id("vintageimprovements:pressurizing/electrolyze_NaCl")

    event.recipes.vintageimprovements.pressurizing(
        [Fluid.of("kubejs:hydrochloric_acid", 1000), Fluid.of("ad_astra:oxygen", 250)],
        [Fluid.of("kubejs:chlorine", 500), Fluid.of("minecraft:water", 500)]
    )
    .secondaryFluidInput(0)
    .id("vintageimprovements:pressurizing/chlorine_disproportion")

    event.custom({
        "type":"vintageimprovements:pressurizing",
        "secondaryFluidInput": 1,
        "heatRequirement": "heated",
        "ingredients": [ 
            {
                "fluid": "kubejs:sodium_hydroxide",
                "amount": 500
            },
            {
                "fluid": "kubejs:chlorine",
                "amount": 500
            }
        ],
        "results": [
            {
                "item": "kubejs:sodium_perchloride",
                "count": 1
            },
            {
                "item": "ratatouille:salt",
                "count": 1
            }
        ],
        "processingTime": 60
    }).id("vintageimprovements:pressurizing/sodium_perchloride")

    event.custom({
        "type":"vintageimprovements:pressurizing",
        "secondaryFluidOutput": 1,
        "heatRequirement": "heated",
        "ingredients": [ 
            {
                "item": "kubejs:sodium_perchloride",
                "count": 1
            },
            {
                "fluid": "kubejs:hydrochloric_acid",
                "amount": 500
            }
        ],
        "results": [
            {
                "fluid": "kubejs:refined_brine",
                "amount": 250
            },
            {
                "fluid": "kubejs:chlorine",
                "amount": 500
            }
        ],
        "processingTime": 60
    }).id("vintageimprovements:pressurizing/comproportion_chlorine")

    event.custom({
        "type":"vintageimprovements:vacuumizing",
        "secondaryFluidOutput": 0,
        "ingredients": [ 
            {
                "fluid": "kubejs:sodium_hydroxide",
                "amount": 1000
            }
        ],
        "results": [
            {
                "item": "kubejs:sodium_hydroxide",
                "count": 4
            }
        ],
        "processingTime": 20
    }).id("vintageimprovements:vacuumizing/solid_NaOH")
    event.recipes.create.mixing(Fluid.of("kubejs:sodium_hydroxide", 1000), [Fluid.of("minecraft:water"), "4x kubejs:sodium_hydroxide"]).id("requiem:mixing/sodium_hydroxide_solution")

    event.custom({
        "type": "createbigcannons:melting",
        "heatRequirement": "heated",
        "ingredients": [
            {
                "item": "kubejs:sodium_nitrate",
            },
            {
                "item": "kubejs:sodium_nitrate",
            }
        ],
        "processingTime": 40,
        "results": [
            {
                "item": "kubejs:sodium_nitrite",
                "count": 2
            },
            {
                "fluid": "ad_astra:oxygen",
                "amount": 250
            }
        ]
    }).id("requiem:melting/NaNO3")

    event.recipes.create.mixing(['kubejs:sodium_nitrate', Fluid.of('kubejs:n2o4', 250)], ['kubejs:sodium_nitrite', Fluid.of('kubejs:nitric_acid', 500)]).id('requiem:mixing/quenching_nitrite')
    event.recipes.create.mixing(['kubejs:sodium_nitrate', 'ratatouille:salt'], ['kubejs:sodium_nitrite', 'kubejs:sodium_perchloride']).id('requiem:mixing/quenching_nitrite_perc')

    event.recipes.create.mixing(['2x kubejs:sodium_vanadate'], ['2x kubejs:sodium_hydroxide', 'kubejs:vanadium_oxide']).id('requiem:mixing/vanadate')
    event.recipes.create.mixing(['2x kubejs:sodium_vanadate'], [Fluid.of('kubejs:sodium_hydroxide', 500), 'kubejs:vanadium_oxide']).id('requiem:mixing/vanadate_from_solution')
    event.recipes.create.mixing(['3x kubejs:sodium_vanadate', '2x create:crushed_raw_lead'], [Fluid.of('kubejs:sodium_hydroxide', 750), 'kubejs:vanadinite']).id('requiem:mixing/vanadate_from_ore')

    event.recipes.create.mixing(['2x ratatouille:salt', 'kubejs:vanadium_oxide'], ['2x kubejs:sodium_vanadate', Fluid.of('kubejs:hydrochloric_acid', 500)]).id('requiem:mixing/free_vanadium_oxide_hcl')
    event.recipes.create.mixing(['kubejs:sodium_sulphate', 'kubejs:vanadium_oxide'], ['2x kubejs:sodium_vanadate', Fluid.of('vintageimprovements:sulfuric_acid', 250)]).id('requiem:mixing/free_vanadium_oxide_h2so4')
    event.recipes.create.mixing(['2x kubejs:sodium_nitrate', 'kubejs:vanadium_oxide'], ['2x kubejs:sodium_vanadate', Fluid.of('kubejs:nitric_acid', 500)]).id('requiem:mixing/free_vanadium_oxide_hno3')

    event.custom({
        "type":"vintageimprovements:pressurizing",
        "secondaryFluidInput": 0,
        "heatRequirement": "heated",
        "ingredients": [
            {
                "fluid": "kubejs:methane",
                "amount": 250
            },
            {
                "item": "kubejs:sodium_hydroxide",
                "count": 1
            },
            {
                "fluid": "kubejs:ammonia",
                "amount": 250
            }
        ],
        "results": [
            {
                "item": "kubejs:sodium_cyanide",
                "count": 1
            },
            {
                "fluid": "ad_astra:hydrogen",
                "amount": 750
            },
            {
                "fluid": "minecraft:water",
                "amount": 250
            }
        ],
        "processingTime": 40
    }).id("vintageimprovements:pressurizing/cyanide")
    //Mg
    const MgSalts = {'kubejs:magnesium_sulphate':'kubejs:sodium_sulphate', 'kubejs:magnesalt':'2x ratatouille:salt', 'kubejs:magnesium_nitrate':'2x kubejs:sodium_nitrate'}
    for(let [salt, product] of Object.entries(MgSalts)){
        event.recipes.create.mixing(['kubejs:brucite', product], ['2x kubejs:sodium_hydroxide', salt]).id('requiem:mixing/'+salt.split(':')[1]+'with_NaOH')
        event.recipes.create.mixing(['kubejs:magnesite', product], ['kubejs:soda_powder', salt]).id('requiem:mixing/'+salt.split(':')[1]+'with_Na2CO3')
    }
    event.recipes.create.mixing(['kubejs:magnesalt', Fluid.of('minecraft:water', 500), Fluid.of('kubejs:carbon_dioxide')], ['kubejs:magnesite', Fluid.of('kubejs:hydrochloric_acid', 500)]).id('requiem:mixing/magnesalt_from_magnesite')
    event.recipes.create.mixing(['kubejs:magnesalt', Fluid.of('minecraft:water', 500)], ['kubejs:brucite', Fluid.of('kubejs:hydrochloric_acid', 500)]).id('requiem:mixing/magnesalt_from_brucite')
    event.recipes.create.mixing(['kubejs:magnesium_sulphate', Fluid.of('minecraft:water', 500), Fluid.of('kubejs:carbon_dioxide', 250)], ['kubejs:magnesite', Fluid.of('vintageimprovements:sulfuric_acid', 250)]).id('requiem:mixing/magnesulfate_from_magnesite')
    event.recipes.create.mixing(['kubejs:magnesium_sulphate', Fluid.of('minecraft:water', 500)], ['kubejs:brucite', Fluid.of('vintageimprovements:sulfuric_acid', 250)]).id('requiem:mixing/magnesulfate_from_brucite')
    event.recipes.create.mixing(['kubejs:magnesium_nitrate', Fluid.of('minecraft:water', 500), Fluid.of('kubejs:carbon_dioxide', 250)], ['kubejs:magnesite', Fluid.of('kubejs:nitric_acid', 500)]).id('requiem:mixing/magnesium_nitrate_from_magnesite')
    event.recipes.create.mixing(['kubejs:magnesium_nitrate', Fluid.of('minecraft:water', 500)], ['kubejs:brucite', Fluid.of('kubejs:nitric_acid', 500)]).id('requiem:mixing/magnesium_nitrate_from_brucite')

    event.blasting('kubejs:magnesia', 'kubejs:brucite').id("requiem:blasting/magnesia_from_brucite")
    event.blasting('kubejs:magnesia', 'kubejs:magnesite').id("requiem:blasting/magnesia_from_magnesite")

    event.recipes.vintageimprovements.pressurizing(
            [Item.of("kubejs:discharged_electrolyzer"), Item.of("kubejs:magnesium_powder"), Fluid.of("kubejs:ethylene_carbonate", 500), Fluid.of("kubejs:chlorine", 250)],
            [Item.of("kubejs:electrolyzer"), Item.of("kubejs:magnesalt"), Fluid.of("kubejs:ethylene_carbonate", 500)]
        )
        .secondaryFluidOutput(1)
        .id("vintageimprovements:pressurizing/electrolyze_MgCl2")

    event.custom({
        "type": "createbigcannons:melting",
        "heatRequirement": "heated",
        "ingredients": [
            {
                "item": "kubejs:magnesite",
                "count": 1
            }
        ],
        "processingTime": 10,
        "results": [
            {
                "item": "kubejs:magnesia",
                "count": 1
            },
            {
                "fluid": "kubejs:carbon_dioxide",
                "amount": 250
            }
        ]
    }).id("requiem:melting/MgCO3")

    event.custom({
        "type":"createaddition:charging",
	    "input": {
      	    "item": "kubejs:magnesia",
		    "count": 1
	    },
	    "result": {
		    "item": "kubejs:magnesium_powder",
		    "count": 1
	    },
	"energy": 8000,
	"maxChargeRate": 400
	}).id('requiem:charging/magnesium_powder')

    event.custom({
        "type":"createaddition:charging",
	    "input": {
      	    "item": "kubejs:magnesalt",
		    "count": 1
	    },
	    "result": {
		    "item": "kubejs:magnesium_powder",
		    "count": 1
	    },
	"energy": 8000,
	"maxChargeRate": 400
	}).id('requiem:charging/magnesium_powder_magnesalt')

    event.shaped(Item.of('immersive_weathering:mortar', 4), ['cb ', 'ba ', '   '], {a:'kubejs:lime_powder', b:'kubejs:magnesia', c:Item.of('minecraft:potion', '{Potion:"minecraft:water"}').strongNBT()}).replaceIngredient(Item.of('minecraft:potion', '{Potion:"minecraft:water"}'),"minecraft:glass_bottle").id("requiem:shaped/mortar")
    event.recipes.create.compacting(["4x alexscaves:cinder_brick"], ['kubejs:magnesia', 'kubejs:lime', '2x immersive_weathering:sand_layer_block']).id('requiem:compacting/cinder_brick')

    event.custom({
        "type":"vintageimprovements:pressurizing",
        "heatRequirement": "heated",
        "secondaryFluidOutput": 0,
        "ingredients": [ 
            {
                "item": "kubejs:magnesium_powder",
                "count": 1
            },
            {
                "fluid": "minecraft:water",
                "amount": 500
            }
        ],
        "results": [
            {
                "item": "kubejs:brucite",
                "count": 1
            },
            {
                "fluid": "ad_astra:hydrogen",
                "amount": 250
            }
        ],
        "processingTime": 40
    }).id("requiem:pressurizing/hydrogen_from_mg_with_water")

    event.custom({
        "type":"vintageimprovements:pressurizing",
        "secondaryFluidOutput": 0,
        "ingredients": [ 
            {
                "item": "kubejs:magnesium_powder",
                "count": 1
            },
            {
                "fluid": "kubejs:hydrochloric_acid",
                "amount": 500
            }
        ],
        "results": [
            {
                "item": "kubejs:magnesalt",
                "count": 1
            },
            {
                "fluid": "ad_astra:hydrogen",
                "amount": 250
            }
        ],
        "processingTime": 10
    }).id("requiem:pressurizing/hydrogen_from_mg_with_hcl")

    event.custom({
        "type":"vintageimprovements:pressurizing",
        "secondaryFluidOutput": 0,
        "ingredients": [ 
            {
                "item": "kubejs:magnesium_powder",
                "count": 1
            },
            {
                "fluid": "vintageimprovements:sulfuric_acid",
                "amount": 250
            }
        ],
        "results": [
            {
                "item": "kubejs:magnesium_sulphate",
                "count": 1
            },
            {
                "fluid": "ad_astra:hydrogen",
                "amount": 250
            }
        ],
        "processingTime": 10
    }).id("requiem:pressurizing/hydrogen_from_mg_with_h2so4")

    event.custom({
        "type":"vintageimprovements:pressurizing",
        "secondaryFluidOutput": 0,
        "ingredients": [ 
            {
                "item": "kubejs:magnesium_powder",
                "count": 1
            },
            {
                "fluid": "kubejs:nitric_acid",
                "amount": 500
            }
        ],
        "results": [
            {
                "item": "kubejs:magnesium_nitrate",
                "count": 1
            },
            {
                "fluid": "ad_astra:hydrogen",
                "amount": 250
            }
        ],
        "processingTime": 10
    }).id("requiem:pressurizing/hydrogen_from_mg_with_hno3")
    //Ca
    event.recipes.create.crushing([Item.of('kubejs:lime_powder', 3), Item.of('kubejs:lime_powder', 1).withChance(0.75)], "#requiem:limestone").processingTime(2*100).id("requiem:crushing/limestone");
    event.shaped(Item.of('minecraft:calcite'), ['aa ', 'aa ', '   '], {a:'kubejs:lime_powder'}).id("requiem:shaped/calcite")
    event.recipes.create.compacting('minecraft:calcite', '4x kubejs:lime_powder').id("requiem:compacting/calcite")
    event.shaped(Item.of('alexscaves:radon_lamp_white', 4), ['DSD', 'SRS', 'DSD'], {D:'minecraft:white_dye', S:'kubejs:scheelite', R:'alexscaves:radon_bottle'}).id("requiem:shaped/radon_lamp_white")

    event.recipes.create.mixing([Fluid.of('kubejs:sodium_hydroxide', 250), 'kubejs:lime_powder'], ['kubejs:soda_powder', 'kubejs:lime', Fluid.of('minecraft:water', 250)]).id('requiem:mixing/NaOH_from_quicklime')
    event.blasting('kubejs:lime', 'kubejs:lime_powder').id("requiem:blasting/lime")
    event.custom({
        "type": "createbigcannons:melting",
        "heatRequirement": "heated",
        "ingredients": [
            {
                "item": "kubejs:lime_powder",
                "count": 1
            }
        ],
        "processingTime": 20,
        "results": [
            {
                "item": "kubejs:lime",
                "count": 1
            },
            {
                "fluid": "kubejs:carbon_dioxide",
                "amount": 250
            }
        ]
    }).id("requiem:melting/CaCO3")

    event.custom({
        "type": "createbigcannons:melting",
        "heatRequirement": "heated",
        "ingredients": [
            {
                "tag": "requiem:limestone",
                "count": 1
            }
        ],
        "processingTime": 80,
        "results": [
            {
                "item": "kubejs:lime",
                "count": 4
            },
            {
                "fluid": "kubejs:carbon_dioxide",
                "amount": 1000
            }
        ]
    }).id("requiem:melting/limestones")

    //Cl
    event.recipes.vintageimprovements.pressurizing(
            [Item.of("kubejs:discharged_electrolyzer"), Fluid.of("ad_astra:hydrogen", 500), Fluid.of("kubejs:chlorine", 250)],
            [Item.of("kubejs:electrolyzer"), Fluid.of("kubejs:hydrochloric_acid", 1000)]
        )
        .secondaryFluidOutput(0)
        .id("vintageimprovements:pressurizing/electrolyze_HCl")

    event.recipes.create.mixing([Fluid.of('biomancy:acid', 250), 'biomancy:living_flesh'], ['biomancy:living_flesh', 'vintagedelight:organic_mash', Fluid.of('kubejs:hydrochloric_acid', 250)]).id('requiem:mixing/garstic_juice')
    event.recipes.create.filling('biomancy:acid_extract', ['biomancy:vial', Fluid.of('biomancy:acid', 250)])

    //NH3
    event.custom({
        "type":"vintageimprovements:pressurizing",
        "secondaryFluidInput": 1,
        "heatRequirement": "heated",
        "ingredients": [ 
            {
                "fluid": "kubejs:ammonia",
                "amount": 500
            },
            {
                "fluid": "kubejs:hydrochloric_acid",
                "amount": 500
            }
        ],
        "results": [
            {
                "item": "kubejs:ammonium_chloride",
                "count": 2
            }
        ],
        "processingTime": 40
    }).id("vintageimprovements:pressurizing/ammonium_chloride")

    event.recipes.create.mixing(['ratatouille:salt', Fluid.of('kubejs:ammonia', 250)], ['kubejs:ammonium_chloride', 'kubejs:sodium_hydroxide']).id('requiem:mixing/ammodia_from_salt')
    event.recipes.create.mixing([Fluid.of('kubejs:refined_brine', 250), Fluid.of('kubejs:ammonia', 250)], ['kubejs:ammonium_chloride', Fluid.of('kubejs:sodium_hydroxide', 250)]).heated().id('requiem:mixing/ammonia_from_salt_alt')

    //Farmer's delight compat
    event.custom({
        "type": "farmersdelight:cooking",
        "container": {
            "item": "minecraft:water_bucket"
        },
        "cookingtime": 40,
        "experience": 1.0,
        "ingredients": [
            {
                "item": "vintagedelight:salt_dust"
            },
            {
                "item": "vintagedelight:salt_dust"
            },
            {
                "item": "vintagedelight:salt_dust"
            },
            {
                "item": "vintagedelight:salt_dust"
            }
        ],
        "recipe_book_tab": "misc",
        "result": {
            "item": "kubejs:brine_bucket"
        }
    }).id('requiem:cooking/brine')
    event.shaped("ratatouille:salt", ['AB ','   ','   '], {A:'kubejs:brine_bucket', B:'vintagedelight:salt_dust'}).replaceIngredient('kubejs:brine_bucket','kubejs:brine_bucket').id('requiem:crafting/refined_salt')

    //electrolyzer
    event.custom({
        "type":"createaddition:charging",
	    "input": {
      	    "item": "kubejs:discharged_electrolyzer",
		    "count": 1
	    },
	    "result": {
		    "item": "kubejs:electrolyzer",
		    "count": 1
	    },
	"energy": 400,
	"maxChargeRate": 400
	}).id('requiem:charging/electrolyzer')
})

ServerEvents.tags('item', event=>{
    event.add('create:blaze_burner_fuel/special', 'kubejs:magnesium_powder')
})