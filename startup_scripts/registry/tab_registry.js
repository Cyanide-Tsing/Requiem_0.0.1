const raw_material = [
    'kubejs:powdered_andesite',
    'kubejs:lithophilic_cluster',
    'kubejs:chalcophilic_cluster',
    'kubejs:rare_earth_cluster',
    'kubejs:vanadinite',
    'kubejs:vanadium_oxide',
    'kubejs:raw_lead',
    'kubejs:lead_ingot',
    'kubejs:lead_nugget',
    'kubejs:lead_plate',
    'kubejs:lead_block',
    'kubejs:dirty_lead_dust',
    'kubejs:lead_dust',
    'kubejs:magnesium_powder',
    'kubejs:magnesium_ingot',
    'kubejs:dirty_uranium_dust',
    'kubejs:uranium_dust',
    'kubejs:uranium_ingot',
    'kubejs:pure_uranium_block',
    'kubejs:radium_sulphate',
    'kubejs:radium_nugget',
    'kubejs:radium_ingot',
    'kubejs:platinum_ingot',
    'kubejs:platinum_nugget',
    'kubejs:platinum_block',
    'kubejs:aluminum_chunk',
    'kubejs:neodymium_ingot',
    'kubejs:galena_vanadite',
    'kubejs:radrock_carminite',
    'kubejs:acrylic',
    'kubejs:ldpe',
    'kubejs:rubber',
    'kubejs:pf'
]

const chemical = [
    'kubejs:sodium_hydroxide',
    'kubejs:soda_powder',
    'kubejs:sodium_perchloride',
    'kubejs:sodium_tungstate',
    'kubejs:sodium_vanadate',
    'kubejs:sodium_nitrite',
    'kubejs:sodium_nitrate',
    'kubejs:sodium_sulphate',
    'kubejs:sodium_cyanide',
    'kubejs:magnesia',
    'kubejs:brucite',
    'kubejs:magnesite',
    'kubejs:magnesalt',
    'kubejs:magnesium_nitrate',
    'kubejs:magnesium_sulphate',
    'kubejs:lime',
    'kubejs:lime_powder',
    'kubejs:scheelite',
    'kubejs:fluorite',
    'kubejs:ammonium_chloride',
    'kubejs:corundum_powder',
    'kubejs:synthetic_ruby',
    'kubejs:chromia',
    'kubejs:brine_bucket',
    'kubejs:refined_brine_bucket',
    'kubejs:raw_uranyl_solution_bucket',
    'kubejs:radioactive_waste_bucket',
    'kubejs:wither_slurry_bucket',
    'kubejs:netherite_slurry_bucket',
    'kubejs:amethyst_mixture_bucket',
    'kubejs:transmutator_solution_bucket',
    'kubejs:volatile_mixture_bucket',
    'kubejs:polymer_substrate_bucket',
    'kubejs:mercury_bucket',
    'kubejs:hydrofluoric_acid_bucket',
    'kubejs:hydrochloric_acid_bucket',
    'kubejs:nitric_acid_bucket',
    'kubejs:ferric_chloride_bucket',
    'kubejs:zinc_chloride_bucket',
    'kubejs:copper_chloride_bucket',
    'kubejs:rednd_chloride_bucket',
    'kubejs:azund_chloride_bucket',
    'kubejs:chloroplatinic_acid_bucket',
    'kubejs:lead_nitrate_bucket',
    'kubejs:silver_nitrate_bucket',
    'kubejs:magnesium_nitrate_bucket',
    'kubejs:ammonium_nitrate_bucket',
    'kubejs:beryllium_nitrate_bucket',
    'kubejs:uranyl_nitrate_bucket',
    'kubejs:netheryl_nitrate_bucket',
    'kubejs:sodium_hydroxide_bucket',
    'kubejs:molten_quartz_bucket',
    'kubejs:molten_cryolite_bucket',
    'kubejs:methane_bucket',
    'kubejs:ethylene_bucket',
    'kubejs:ammonia_bucket',
    'kubejs:carbon_dioxide_bucket',
    'kubejs:formaldehyde_bucket',
    'kubejs:glycerol_nitrate_bucket',
    'kubejs:trinitrophenol_bucket',
    'kubejs:acetic_acid_bucket',
    'kubejs:propylene_bucket',
    'kubejs:acrylic_acid_bucket',
    'kubejs:benzene_bucket',
    'kubejs:phenylamine_bucket',
    'kubejs:nitrobenzene_bucket',
    'kubejs:phenol_bucket',
    'kubejs:isopropanol_bucket',
    'kubejs:isoprene_bucket',
    'kubejs:udmh_bucket',
    'kubejs:n2o4_bucket',
    'kubejs:fuel_mix_bucket',
    'kubejs:nitro_mix_bucket',
    'kubejs:chlormethine_bucket',
    'kubejs:epoxyethylene_bucket',
    'kubejs:ethylene_carbonate_bucket'
]

const biology = [
    'kubejs:brewer_s_yeast',
    'kubejs:alien_sediment',
    'kubejs:yeast_dna',
    'kubejs:attachment_dna',
    'kubejs:subterranodon_dna',
    'kubejs:vallumraptor_dna',
    'kubejs:grottoceratops_dna',
    'kubejs:trilocaris_dna',
    'kubejs:tremorsaurus_dna',
    'kubejs:relicheirus_dna',
    'kubejs:atlantitan_dna',
    'kubejs:egg_item_trilocaris',
    'kubejs:attachment_colony',
    'kubejs:attachment_unit'
]

const create_components_and_machinery = [
    'kubejs:demon_core',
    'kubejs:thermal_exchanger',
    'kubejs:turbine',
    'kubejs:magnesium_cell',
    'kubejs:fluid_bin',
    'kubejs:universal_andesite_machinery',
    'kubejs:universal_brass_machinery',
    'kubejs:universal_copper_machinery',
    'kubejs:universal_logistical_machinery',
    'kubejs:universal_redstone_machinery',
    'kubejs:universal_sturdy_machinery',
    'kubejs:universal_zinc_machinery',
    'kubejs:insulated_copper_coil',
    'kubejs:atomic_catalyst',
    'kubejs:assembly_universal_andesite_machinery',
    'kubejs:assembly_universal_brass_machinery',
    'kubejs:assembly_universal_copper_machinery',
    'kubejs:assembly_universal_logistical_machinery',
    'kubejs:assembly_universal_redstone_machinery',
    'kubejs:assembly_universal_sturdy_machinery',
    'kubejs:assembly_universal_zinc_machinery'
]

const create_miscellaneous = [
    'kubejs:electrolyzer',
    'kubejs:discharged_electrolyzer',
    'kubejs:steel_can',
    'kubejs:empty_can',
    'kubejs:gas_grenade',
    'kubejs:canned_tomato_pea_soup',
    'kubejs:canned_meat_stew',
    'kubejs:meat_stew_bucket',
    'kubejs:tomato_pea_soup_bucket'
]

const requiem_compat = [
    'ad_astra:mars_microbe_fossil',
    'ad_astra:crushed_raw_desh',
    'ad_astra:crushed_raw_ostrum',
    'ad_astra:crushed_raw_calorite',
    'ad_astra:dirty_desh_dust',
    'ad_astra:desh_dust',
    'ad_astra:dirty_ostrum_dust',
    'ad_astra:ostrum_dust',
    'ad_astra:dirty_calorite_dust',
    'ad_astra:calorite_dust',
    'iceandfire:dirty_silver_dust',
    'iceandfire:silver_dust'
]

const requiem_native = [
    'requiem:enigmatic_tome',
    'requiem:manual_of_brass',
    'requiem:page_of_antigravity',
    'requiem:page_of_charged',
    'requiem:page_of_radioactivity'
    //Item.of('requiem:page_of_charged', 1, '{energy:0}')
]

const goety_miscellaneous = [
    'kubejs:ominous_cannoli'
]

StartupEvents.registry('creative_mode_tab', event => {
    event.create('requiem:requiem_create_raw_materials')
      .icon(() => Item.of('kubejs:powdered_andesite'))
      .content(() => raw_material).displayName = Text.translatable("kubejs.creative_tab.raw_materials")

    event.create('requiem_requiem:create_chemical')
      .icon(() => Item.of('kubejs:sodium_hydroxide'))
      .content(() => chemical).displayName = Text.translatable("kubejs.creative_tab.chemical")

    event.create('requiem:requiem_create_biology')
      .icon(() => Item.of('kubejs:powdered_andesite'))
      .content(() => biology).displayName = Text.translatable("kubejs.creative_tab.biology")

    event.create('requiem:requiem_create_components')
      .icon(() => Item.of('kubejs:universal_brass_machinery'))
      .content(() => create_components_and_machinery).displayName = Text.translatable("kubejs.creative_tab.components")

    event.create('requiem:requiem_create_miscellaneous')
      .icon(() => Item.of('kubejs:canned_tomato_pea_soup'))
      .content(() => create_miscellaneous).displayName = Text.translatable("kubejs.creative_tab.c_miscellaneous")

    event.create('requiem:requiem_goety_miscellaneous')
      .icon(() => Item.of('kubejs:ominous_cannoli'))
      .content(() => goety_miscellaneous).displayName = Text.translatable("kubejs.creative_tab.g_miscellaneous")

    event.create('requiem:requiem_native')
      .icon(() => Item.of('requiem:manual_of_brass'))
      .content(() => requiem_native).displayName = Text.translatable("kubejs.creative_tab.native")

    event.create('requiem:requiem_compat')
      .icon(() => Item.of('ad_astra:crushed_raw_desh'))
      .content(() => requiem_compat).displayName = Text.translatable("kubejs.creative_tab.compat")
})

StartupEvents.modifyCreativeTab('kubejs:tab', event => {
    raw_material.forEach(e =>{
        event.remove(e)
    })
    chemical.forEach(e =>{
        event.remove(e)
    })
    biology.forEach(e=>{
        event.remove(e)
    })
    create_miscellaneous.forEach(e=>{
        event.remove(e)
    })
    goety_miscellaneous.forEach(e=>{
        event.remove(e)
    })
    requiem_native.forEach(e=>{
        event.remove(e)
    })
    requiem_compat.forEach(e=>{
        event.remove(e)
    })
    create_components_and_machinery.forEach(e=>{
        event.remove(e)
    })
    event.remove('requiem:page_of_charged')
})
/*
StartupEvents.modifyCreativeTab('Atomicraft', event => {
	// Change tab icon
	event.icon = 'kubejs:example_block'
	// Change display name. Technically supports formatting, but it's not recommended
	event.displayName = Text.darkRed('Functional Blocks!')
})*/
