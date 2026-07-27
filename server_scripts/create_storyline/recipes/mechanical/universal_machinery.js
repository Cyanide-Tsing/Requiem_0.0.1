const ANDESITE = [
    '32x create:shaft',
    '16x create:cogwheel',
    '16x create:large_cogwheel',
    '4x create:andesite_casing',
    '4x create:gearbox',
    '4x create:vertical_gearbox',
    '2x create_connected:parallel_gearbox',
    '2x create_connected:vertical_parallel_gearbox',
    '2x create_connected:six_way_gearbox',
    '2x create_connected:vertical_six_way_gearbox',
    'create_connected:centrifugal_clutch',
    '4x create:encased_chain_drive',
    '4x create_connected:encased_chain_cogwheel',
    '2x create:clutch',
    '2x create:gearshift',
    '2x create_connected:inverted_clutch',
    '2x create_connected:inverted_gearshift',
    'create:chain_conveyor',
    '2x create:encased_fan',
    '2x create:mechanical_press',
    '4x create:depot',
    '4x create:weighted_ejector',
    'create:millstone',
    '2x create:mechanical_drill',
    'create:speedometer',
    'create:stressometer',
    '2x create:mechanical_saw',
    '2x createaddition:rolling_mill',
    'create:deployer',
    'create:mechanical_harvester',
    'create:mechanical_plough',
    'vintageimprovements:curving_press',
    'vintageimprovements:spring_coiling_machine',
    'vintageimprovements:vibrating_table'
]

const FLUID = [
    '16x supplementaries:faucet',
    '32x create:fluid_pipe',
    '16x create:mechanical_pump',
    '16x create:fluid_tank',
    '16x create_connected:fluid_vessel',
    '16x create:copper_casing',
    '16x create:spout',
    '16x create:fluid_valve',
    '8x create:smart_fluid_pipe',
    '64x create:copper_valve_handle',
    '16x create:item_drain',
    '8x create:hose_pulley',
    '8x create:portable_fluid_interface',
    'create_enchantment_industry:disenchanter',
    'create_enchantment_industry:printer'
]

const BRASS = [
    '4x create:smart_chute',
    '4x create:mechanical_crafter',
    '2x create:sequenced_gearshift',
    '2x create:rotation_speed_controller',
    '8x create:brass_funnel',
    '4x create:brass_tunnel',
    '4x create:content_observer',
    '4x create:stockpile_switch',
    '4x createfluidstuffs:multi_fluid_tank',
    '2x create:display_link'
]

const ELECTRIC = [
    'powergrid:conductive_casing',
    '4x powergrid:wire_connector',
    '2x powergrid:heavy_wire_connector',
    '2x powergrid:cord_junction',
    'powergrid:heating_coil',
    'powergrid:basin_heater',
    'powergrid:voltage_gauge',
    'powergrid:current_gauge',
    'powergrid:power_gauge',
    'powergrid:plotter',
    'powergrid:generator_induction_rotor',
    'powergrid:generator_commutator',
    'powergrid:generator_vertical_commutator',
    'powergrid:generator_clutch',
    '2x powergrid:generator_housing',
    '2x powergrid:vertical_generator_housing',
    '4x powergrid:lv_switch',
    '4x powergrid:lv_button',
    '2x powergrid:mv_switch',
    'powergrid:hv_switch',
    'powergrid:hv_breaker',
    'powergrid:spark_gap',
    'powergrid:contactor',
    '2x powergrid:power_resistor',
    '2x powergrid:light_fixture',
    'powergrid:variac',
    'powergrid:electric_motor',
    'powergrid:constant_speed_motor',
    'powergrid:electromagnet',
    'powergrid:electric_fan',
    '2x powergrid:device_connector',
    '2x powergrid:socket',
    '2x powergrid:fuse_holder',
    'powergrid:rheostat',
    'powergrid:grounding_rod',
    'powergrid:carbon_pile_coil',
    '16x powergrid:insulated_copper_wire',
    '4x powergrid:resistive_coil',
    '4x powergrid:copper_coil',
    'createaddition:alternator'
]

const LOGISTICAL = [
    '32x minecraft:chain',
    '2x minecraft:hopper',
    '2x minecraft:chest',
    '2x minecraft:barrel',
    '8x create:chute',
    '8x create:andesite_funnel',
    '4x create:andesite_tunnel',
    '4x create:item_vault',
    '2x create:item_hatch',
    '2x create:packager',
    '2x create:repackager',
    'create:package_frogport',
    'create:white_postbox',
    '2x create:stock_link',
    '2x create:stock_ticker',
    'create:redstone_requester',
    '4x create:factory_gauge',
    '4x create:display_board',
    'createmetallurgy:labeling_station'
]

const STURDY = [
    '2x createdieselgenerators:basin_lid',
    '2x createdieselgenerators:bulk_fermenter',
    '2x create:basin',
    '2x createbigcannons:basin_foundry_lid',
    '2x ratatouille:oven',
    '2x minecraft:cauldron',
    'createmetallurgy:foundry_basin',
    'createmetallurgy:casting_basin',
    'createmetallurgy:casting_table',
    'createmetallurgy:foundry_lid',
    'createmetallurgy:ghast_transfer_ladle',
    'createmetallurgy:cute_transfer_ladle',
    'createmetallurgy:old_transfer_ladle',
    'createmetallurgy:strider_transfer_ladle'
]

const REDSTONE = [
    'minecraft:oak_button',
    'minecraft:stone_button',
    '3x minecraft:redstone_torch',
    '3x minecraft:redstone',
    'minecraft:repeater',
    'minecraft:comparator',
    'minecraft:lever',
    'minecraft:oak_sign',
    'minecraft:note_block',
    'minecraft:observer',
    'quark:redstone_randomizer',
    'create:redstone_link',
    'create:pulse_repeater',
    'create:pulse_extender',
    'create:pulse_timer',
    'create:powered_latch',
    'create:powered_toggle_latch'
]

ServerEvents.recipes(event=>{
    ANDESITE.forEach(component=>{
        event.stonecutting(component, 'kubejs:universal_andesite_machinery').id("requiem:stonecutting/"+component.toString().split(':')[1])
        event.recipes.vintageimprovements.turning(component, 'kubejs:universal_andesite_machinery').processingTime(10).id("requiem:turning/"+component.toString().split(':')[1])
    })
    BRASS.forEach(component=>{
        event.stonecutting(component, 'kubejs:universal_brass_machinery').id("requiem:stonecutting/"+component.toString().split(':')[1])
        event.recipes.vintageimprovements.turning(component, 'kubejs:universal_brass_machinery').processingTime(10).id("requiem:turning/"+component.toString().split(':')[1])
    })
    FLUID.forEach(component=>{
        event.stonecutting(component, 'kubejs:universal_copper_machinery').id("requiem:stonecutting/"+component.toString().split(':')[1])
        event.recipes.vintageimprovements.turning(component, 'kubejs:universal_copper_machinery').processingTime(10).id("requiem:turning/"+component.toString().split(':')[1])
    })
    ELECTRIC.forEach(component=>{
        event.stonecutting(component, 'kubejs:universal_zinc_machinery').id("requiem:stonecutting/"+component.toString().split(':')[1])
        event.recipes.vintageimprovements.turning(component, 'kubejs:universal_zinc_machinery').processingTime(10).id("requiem:turning/"+component.toString().split(':')[1])
    })
    event.stonecutting('createaddition:electric_motor', 'kubejs:universal_zinc_machinery').id("requiem:stonecutting/cca_electric_motor")
    event.recipes.vintageimprovements.turning('createaddition:electric_motor', 'kubejs:universal_zinc_machinery').processingTime(10).processingTime(10).id("requiem:turning/cca_electric_motor")
    STURDY.forEach(component =>{
        event.stonecutting(component, 'kubejs:universal_sturdy_machinery').id("requiem:stonecutting/"+component.toString().split(':')[1])
        event.recipes.vintageimprovements.turning(component, 'kubejs:universal_sturdy_machinery').processingTime(10).id("requiem:turning/"+component.toString().split(':')[1])
    })
    event.stonecutting('4x createmetallurgy:faucet', 'kubejs:universal_sturdy_machinery').id("requiem:stonecutting/metallurgy_faucet")
    event.recipes.vintageimprovements.turning('4x createmetallurgy:faucet', 'kubejs:universal_sturdy_machinery').processingTime(10).id("requiem:turning/metallurgy_faucet")
    REDSTONE.forEach(component=>{
        event.stonecutting(component, 'kubejs:universal_redstone_machinery').id("requiem:stonecutting/"+component.toString().split(':')[1])
        event.recipes.vintageimprovements.turning(component, 'kubejs:universal_redstone_machinery').processingTime(10).id("requiem:turning/"+component.toString().split(':')[1])
    })
    LOGISTICAL.forEach(component=>{
        event.stonecutting(component, 'kubejs:universal_logistical_machinery').id("requiem:stonecutting/"+component.toString().split(':')[1])
        event.recipes.vintageimprovements.turning(component, 'kubejs:universal_logistical_machinery').processingTime(10).id("requiem:turning/"+component.toString().split(':')[1])
    })
})