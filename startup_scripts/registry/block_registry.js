//Blocks
StartupEvents.registry('block', event =>{
  event.create('acrylic').soundType('glass').hardness(6).resistance(100).requiresTool(true).notSolid().noValidSpawns(true).suffocating(false).viewBlocking(false).redstoneConductor(false).transparent(true).renderType("translucent").tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool');
  event.create('platinum_block').soundType('stone').hardness(6).resistance(9).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool');
  event.create('pure_uranium_block').soundType('stone').hardness(9).resistance(12).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool');
  event.create('lead_block').soundType('stone').hardness(6).resistance(9).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool');
  //event.create('beryllium_copper_block').soundType('stone').hardness(6).resistance(9).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool');
  //event.create('beryllium_copper_casing').soundType('stone').hardness(6).resistance(9).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool');
  
  event.create('porous_ice').textureAll('minecraft:block/ice').soundType('stone').hardness(6).resistance(9).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool');
  event.create('graphite_block').soundType('stone').hardness(6).resistance(9).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool');
  event.create('thorium_block').soundType('stone').hardness(6).resistance(9).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool');
  event.create('plutonium_block').soundType('stone').hardness(6).resistance(9).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool');

  event.create('galena_vanadinite').soundType('stone').hardness(4).resistance(2).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool');
  event.create('radrock_carminite').soundType('stone').hardness(4).resistance(2).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool');
  event.create('ad_astra:mars_microbe_fossil').soundType('stone').hardness(4).resistance(2).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool');

  event.create('arcane_crystal').soundType('glass').hardness(114514).resistance(114514).requiresTool(true).notSolid().noValidSpawns(true).suffocating(false).viewBlocking(false).redstoneConductor(false).transparent(true).renderType("translucent").lightLevel(0.75).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_diamond_tool');
  event.create('deactivated_alphabet').soundType('stone').hardness(6).resistance(1).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool').fullBlock(false).viewBlocking(false).renderType("translucent").defaultCutout().model('kubejs:block/alphabet')

  event.create('soul_glass').soundType('glass').hardness(1).resistance(1).requiresTool(true).notSolid().noValidSpawns(true).suffocating(false).viewBlocking(false).redstoneConductor(false).transparent(true).renderType("translucent").lightLevel(0).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_diamond_tool');
})