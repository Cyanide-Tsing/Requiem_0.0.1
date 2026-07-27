StartupEvents.registry('mob_effect', event => {
    event.create('charged')
        .color(0xffeba7)
        .harmful()
        .effectTick((entity, level) => global.charged(entity, level))
    event.create('fire_aspect')
        .color(0x7d2626)
        .harmful()
        .effectTick((entity, level) => global.fire_aspect(entity, level))
    event.create('inherited_magic')
        .color(0xc563f3)
        .effectTick((entity, level) => global.inherited_magic(entity, level))
    let suffocationEffect = event.create('suffocation')
        .color(0xc8ff00)
        .effectTick((entity, level) => {
            global.chlorinated_suffocation(entity, level)
        }).createObject()
})

global.charged = (entity, level) =>{}

global.fire_aspect = (entity, level) =>{
    entity.setSecondsOnFire(5*level)
}

global.inherited_magic = (entity, level) => {}

global.chlorinated_suffocation = (entity, level) =>{
    entity.attack(entity.level.damageSources().drown(), 3*(level+1));
}

StartupEvents.registry('potion', e=>{
   let PotionBuilder = Java.loadClass('dev.latvian.mods.kubejs.misc.PotionBuilder')
   let suffocationEffect = `kubejs:suffocation`
 
   e.createCustom('kubejs:suffocate', ()=>{
      return new PotionBuilder(`kubejs_suffocation`)
      .effect(suffocationEffect, 200, 0)
      .createObject()
   })
 
   e.createCustom('kubejs:long_suffocate', ()=>{
      return new PotionBuilder(`kubejs_suffocation`)
      .effect(suffocationEffect, 600, 0)
      .createObject()
   })
 
   e.createCustom('kubejs:strong_suffocate', ()=>{
      return new PotionBuilder(`kubejs_suffocation`)
      .effect(suffocationEffect, 200, 1)
      .createObject()
   })
 
})