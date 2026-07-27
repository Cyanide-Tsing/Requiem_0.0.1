Platform.mods.kubejs.name = 'Requiem'

//Create Minerals
StartupEvents.registry('item', event => {
    event.create('powdered_andesite')
    event.create('lithophilic_cluster')
    event.create('chalcophilic_cluster')
    event.create('rare_earth_cluster')
    event.create('magnesium_powder');
    event.create('magnesium_ingot');
    event.create('vanadinite');
    event.create('vanadium_oxide');
    event.create('platinum_ingot');
    event.create('platinum_nugget');
    event.create('raw_lead')
    event.create('lead_ingot');
    event.create('lead_nugget');
    event.create('dirty_lead_dust');
    event.create('lead_dust');
    event.create('dirty_uranium_dust');
    event.create('uranium_dust');
    event.create('uranium_ingot');
    event.create('neodymium_ingot').tooltip('§kAA§r§7POWER OF NEO§r§kAA§r');
    event.create('radium_sulphate_crystal');
    event.create('radium_nugget');
    event.create('radium_ingot');
})

//Create Components
StartupEvents.registry('item', event => {
    event.create('universal_andesite_machinery')
    event.create('universal_copper_machinery')
    event.create('universal_brass_machinery')
    event.create('universal_zinc_machinery')
    event.create('universal_sturdy_machinery')
    event.create('universal_logistical_machinery')
    event.create('universal_redstone_machinery')
    event.create('glistening_quartz')
    event.create('polished_glistening_quartz')
})

//Create Electricity
StartupEvents.registry('item', event => {
    event.create('electrolyzer').maxStackSize(2)
    event.create('discharged_electrolyzer').maxStackSize(16)
    event.create('insulated_copper_coil')
})

//Create & Fossils
StartupEvents.registry('item', event => {
    event.create('brewer_s_yeast')

    event.create('alien_sediment')

    event.create('yeast_dna').texture('kubejs:item/dna/yeast_dna')
    event.create('attachment_dna').texture('kubejs:item/dna/attachment_dna')
    event.create('subterranodon_dna').texture('kubejs:item/dna/subterranodon_dna')
    event.create('vallumraptor_dna').texture('kubejs:item/dna/vallumraptor_dna')
    event.create('grottoceratops_dna').texture('kubejs:item/dna/grottoceratops_dna')
    event.create('trilocaris_dna').texture('kubejs:item/dna/trilocaris_dna')
    event.create('tremorsaurus_dna').texture('kubejs:item/dna/tremorsaurus_dna')
    event.create('relicheirus_dna').texture('kubejs:item/dna/relicheirus_dna')
    event.create('atlantitan_dna').texture('kubejs:item/dna/atlantitan_dna')

    event.create('attachment_colony').maxStackSize(1)
    event.create('attachment_unit').maxStackSize(1)

    event.create('egg_item_trilocaris').texture('kubejs:item/egg/trilocaris')
})

//Create Miscellenous
StartupEvents.registry('item', event => {
    event.create('compound').color((item, tintIndex)=>global.compoundTint(item, tintIndex))
    event.create('ldpe');
    event.create('salicylic_acid');
    event.create('menthol').food(food =>{food.hunger(1).saturation(1).alwaysEdible().fastToEat()});
    event.create('glycine').food(food =>{food.hunger(2).saturation(1).alwaysEdible().fastToEat()});
    event.create('rubber');
    event.create('steel_can');
    event.create('empty_can');
    event.create('pf');
    event.create('cation_exchange_resin').texture('kubejs:item/pf').color((item, tintIndex)=>global.compoundTint(item, tintIndex));
    event.create('anion_exchange_resin').texture('kubejs:item/pf').color((item, tintIndex)=>global.compoundTint(item, tintIndex));
    event.create('atomic_catalyst').tooltip(Text.translate("item.kubejs.atomic_catalyst.tooltip"));
})

//inorganic compounds
StartupEvents.registry('item', event =>{
    //Na
    event.create('sodium_hydroxide');
    event.create('soda_powder');
    event.create('sodium_perchloride');
    event.create('sodium_tungstate');
    event.create('sodium_vanadate');
    event.create('sodium_nitrite');
    event.create('sodium_nitrate');
    event.create('sodium_sulphate');
    event.create('sodium_cyanide');
    //Mg
    event.create('magnesia');
    event.create('brucite');
    event.create('magnesite');
    event.create('magnesalt');
    event.create('magnesium_nitrate');
    event.create('magnesium_sulphate');
    //Ca
    event.create('lime');
    event.create('lime_powder');
    event.create('scheelite');
    event.create('fluorite');
    //NH4
    event.create('ammonium_chloride');
    //Al
    event.create('aluminum_chunk');
    event.create('corundum_powder');
    event.create('synthetic_ruby');
    //Cr
    event.create('chromia');
  })

//food
StartupEvents.registry('item', event =>{
  event.create('canned_tomato_pea_soup').tooltip(Text.translate("item.kubejs.canned_tomato_pea_soup.tooltip"))
  .maxStackSize(16).food(food =>{
    food.hunger(10)
    .effect('minecraft:speed', 2000, 1, 1)
    .effect('minecraft:haste', 2000, 2, 1)
    .removeEffect('minecraft:bad_omen')
    .removeEffect('minecraft:weakness')
    .removeEffect('minecraft:slowness')
    .saturation(0.5)
    .eaten(ctx => {
      if(!ctx.player) return;
      else ctx.player.give(Item.of("kubejs:empty_can"))
  })});
  event.create('canned_meat_stew').tooltip(Text.translate("item.kubejs.canned_meat_stew.tooltip"))
  .maxStackSize(16).food(food =>{
    food.hunger(6)
    .effect('minecraft:strength', 2000, 1, 1)
    .effect('minecraft:regeneration', 1000, 1, 0)
    .saturation(1.5)
    .eaten(ctx => {
      if(!ctx.player) return;
      else ctx.player.give(Item.of("kubejs:empty_can"))
  })});
})

//Assembly mediate
StartupEvents.registry('item', event =>{
  event.create('assembly_rednd').barWidth(itemstack => {
    if(itemstack?.nbt) return itemstack.nbt.contains('SequencedAssembly') ? itemstack.nbt.SequencedAssembly.getDouble('Progress')*13 : 0;
    else return 0
  }).barColor(itemstack => Color.AQUA);

  event.create('assembly_azund').barWidth(itemstack => {
    if(itemstack?.nbt) return itemstack.nbt.contains('SequencedAssembly') ? itemstack.nbt.SequencedAssembly.getDouble('Progress')*13 : 0;
    else return 0
  }).barColor(itemstack => Color.AQUA);

  event.create('assembly_netherite').barWidth(itemstack => {
    if(itemstack?.nbt) return itemstack.nbt.contains('SequencedAssembly') ? itemstack.nbt.SequencedAssembly.getDouble('Progress')*13 : 0;
    else return 0
  }).barColor(itemstack => Color.AQUA);

  event.create('assembly_circuit').barWidth(itemstack => {
    if(itemstack?.nbt) return itemstack.nbt.contains('SequencedAssembly') ? itemstack.nbt.SequencedAssembly.getDouble('Progress')*13 : 0;
    else return 0
  }).barColor(itemstack => Color.AQUA);

  event.create('assembly_universal_andesite_machinery').barWidth(itemstack => {
    if(itemstack?.nbt) return itemstack.nbt.contains('SequencedAssembly') ? itemstack.nbt.SequencedAssembly.getDouble('Progress')*13 : 0;
    else return 0
  })
  .barColor(itemstack => Color.LIGHT_GRAY_DYE);
  event.create('assembly_universal_copper_machinery').barWidth(itemstack => {
    if(itemstack?.nbt) return itemstack.nbt.contains('SequencedAssembly') ? itemstack.nbt.SequencedAssembly.getDouble('Progress')*13 : 0;
    else return 0
  })
  .barColor(itemstack => Color.ORANGE_DYE);
  event.create('assembly_universal_brass_machinery').barWidth(itemstack => {
    if(itemstack?.nbt) return itemstack.nbt.contains('SequencedAssembly') ? itemstack.nbt.SequencedAssembly.getDouble('Progress')*13 : 0;
    else return 0
  })
  .barColor(itemstack => Color.YELLOW);
  event.create('assembly_universal_zinc_machinery').barWidth(itemstack => {
    if(itemstack?.nbt) return itemstack.nbt.contains('SequencedAssembly') ? itemstack.nbt.SequencedAssembly.getDouble('Progress')*13 : 0;
    else return 0
  })
  .barColor(itemstack => Color.GREEN);
  event.create('assembly_universal_sturdy_machinery').barWidth(itemstack => {
    if(itemstack?.nbt) return itemstack.nbt.contains('SequencedAssembly') ? itemstack.nbt.SequencedAssembly.getDouble('Progress')*13 : 0;
    else return 0
  })
  .barColor(itemstack => Color.GRAY);
  event.create('assembly_universal_logistical_machinery').barWidth(itemstack => {
    if(itemstack?.nbt) return itemstack.nbt.contains('SequencedAssembly') ? itemstack.nbt.SequencedAssembly.getDouble('Progress')*13 : 0;
    else return 0
  })
  .barColor(itemstack => Color.BLUE);
  event.create('assembly_universal_redstone_machinery').barWidth(itemstack => {
    if(itemstack?.nbt) return itemstack.nbt.contains('SequencedAssembly') ? itemstack.nbt.SequencedAssembly.getDouble('Progress')*13 : 0;
    else return 0
  })
  .barColor(itemstack => Color.RED);
})

//Create:Metallurgy - more powder
StartupEvents.registry('item', event => {
  event.create('ad_astra:crushed_raw_desh');
  event.create('ad_astra:crushed_raw_ostrum');
  event.create('ad_astra:crushed_raw_calorite');
  event.create('ad_astra:dirty_desh_dust');
  event.create('ad_astra:desh_dust');
  event.create('ad_astra:dirty_ostrum_dust');
  event.create('ad_astra:ostrum_dust');
  event.create('ad_astra:dirty_calorite_dust');
  event.create('ad_astra:calorite_dust');
})

StartupEvents.registry('item', event => {
  event.create('iceandfire:dirty_silver_dust');
  event.create('iceandfire:silver_dust');
})
//Tint Index for Chemicals

/**
 * @param {Itemstack} item
 * {ions:[{ion, number}]}
 * @param {int} tintIndex 
 * @returns 
 */
global.compoundTint = (item, tintIndex) =>{
  if(!item.nbt?.ions || item.nbt?.ions.length < 1)return -1;
  let overallColor, r = 0x000000, g=0x000000, b=0x000000;
  let ions = item.nbt.ions;
  ions.forEach(element => {
    r += (ionTinting[element.ion]>>16) & 0xff;
    g += (ionTinting[element.ion]>>8) & 0xff;
    b += ionTinting[element.ion] & 0xff;
  });
  r = Math.floor(r/ions.length)
  g = Math.floor(g/ions.length)
  b = Math.floor(b/ions.length)
  overallColor = (r<<16) | (g<<8) | (b)
  return overallColor
}

const ionTinting = {
  //cations
  'Be': 0x7a9eff,
  'NH4': 0xffffff,
  'Na': 0xff6155,
  'Mg': 0xfad2f5,
  'Al': 0xffffff,
  'K': 0xaee7fa,
  'Ca': 0xffffff,
  'Fe': 0x7d4700,
  'Cu': 0x000279,
  'Zn': 0x0079fe,
  'Ag': 0x4b433a,
  'ANd': 0x3f00bc,
  'SNd': 0x9a002c,
  'Au': 0x610000,
  'Pt': 0xc4ffff,
  'Pb': 0xfff8cf,
  'Bi': 0xff00ea,
  'Ra': 0x14ffd4,
  'UO2': 0x39ff14,
  //anions
  'SO4': 0xedffff,
  'NO2': 0xb3efff,
  'NO3': 0xffecb3,
  'CO3': 0xcabdaf,
  'O': 0xffffff,
  'OH': 0xffffff,
  'F': 0xe1a9ff,
  'Cl': 0xc5ffa3,
  'Ac': 0xa59d6e,
  'PhO': 0xd3e9ff,
  'WO4': 0xffff01,
  'VO3': 0xffff91
}
/*global.thrownDynamite = (itemstack, level, entity, tick) => {
    console.log(`1438019378247832710341`);
    let p = entity;
    if(itemstack<=0)return;
    if(!p.isCreative){
        itemstack.shrink(1);
    }
    let yaw = p.yRot*(Math.PI/180);
    let pitch = p.xRot*(Math.PI/180);
    const v0 = 3.0;
    const Vec3 = Java.load("net.minecraft.world.phys.Vec3");
    const dynamite = level.createEntity('kubejs:dynamite');
    dynamite.x = p.x;
    dynamite.y = p.y+p.getEyeHeight()-0.1;
    dynamite.z = p.z;
    let motion = new Vec3(-Math.sin(yaw)*Math.cos(pitch), -v0*Math.sin(pitch), Math.cos(yaw)*Math.cos(pitch));
    dynamite.setDeltaMovement(motion);
    dynamite.spawn();
}*/

/*
    if(entity.inventory.countNonEmpty() > 7)return;
    let BatteryPos = findInvBackUp(entity)
    if(BatteryPos === -1)return;
    let Battery = entity.inventory.getItem(BatteryPos)
    let storedEnergy = entity.getCapability(ForgeCapabilities.ENERGY).resolve().orElse(null).getEnergyStored()
    let energyExtracted = Math.min(32767-storedEnergy, 10*Math.min(10, Battery.nbt.energy))
    entity.inventory.insertItem(Item.of('kubejs:dry_cell',1,{energy:Battery.nbt.energy - energyExtracted / 10}),false);
    entity.inventory.removeItem(BatteryPos, 1);
    entity.getCapability(ForgeCapabilities.ENERGY).resolve().orElse(null).receiveEnergy(energyExtracted, false)
    */

