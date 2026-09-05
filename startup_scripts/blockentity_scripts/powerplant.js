
const cooling = [
    'hotbath:hot_water_block',
    'minecraft:water',
    'minecraft:ice',
    'minecraft:packed_ice',
    'minecraft:blue_ice'
];

const decay = {
  'alexscaves:block_of_uranium':{
    product:'alexscaves:packed_galena',
    duration: 64
  },
  'alexscaves:uranium_rod':{
    product:'minecraft:air',
    duration: 16
  },
  'alexscaves:unrefined_waste':{
    product:'alexscaves:radrock',
    duration: 4
  },
  'kubejs:pure_uranium_block':{
    product:'kubejs:lead_block',
    duration: 576
  },
  'kubejs:thorium_block':{
    product:'kubejs:lead_block',
    duration: 192
  },
  'kubejs:plutonium_block':{
    product:'kubejs:thorium_block',
    duration: 192
  }
}

let counter=0;

global.doEnergy = (level, x, y, z) =>{
    //console.log(`[1f]random_tick_demon_core${checkUraniumAround(level, x, y, z)}`);
    counter++
    if(counter%10 !== 0)return;
    //counter = 0
    if(checkUraniumAround(level, x, y, z) === 0)return;
    let fuel = Math.pow(checkUraniumAround(level, x, y, z), 3)/216;
    alterCoolingAround(level, x, y, z, fuel);
    alterFuelAround(level, x, y, z);
    explosionIfHydrogen(level, x, y, z);
    if (Math.random() < 0.15) {
        let particle = level.createEntity('kubejs:alpha_particle')
        particle.setPosition(x-0.5+2*Math.random(), y-0.5+2*Math.random(), z-0.5+2*Math.random())
        particle.spawn()
    }
}

function checkUraniumAround(level, x, y, z){
    return (checkUranium(level, x+1, y, z) + checkUranium(level, x-1, y, z) + checkUranium(level, x, y+1, z) + 
    checkUranium(level, x, y-1, z) + checkUranium(level, x, y, z+1) + checkUranium(level, x, y, z-1))
}

function checkUranium(level, x1, y1, z1){
    if(decay.hasOwnProperty(level.getBlock(x1, y1, z1).id))return 1;
    else return 0;
}

function alterCoolingAround(level, x, y, z, fuel){
  let i,j,k;  
  const range = 2;
  for(i = x+range; i >= x-range; i--){
    for(j = y+range; j >= y-range; j--){
      for(k = z+range; k >= z-range; k--){
        let block = level.getBlock(i,j,k);
        if(cooling.includes(block.id)){
          if(Math.random()<fuel){
            if(cooling.indexOf(block.id)>0){
              block.set(cooling[cooling.indexOf(block.id)-1])
            }
            else{
              if(fuel>0.75) block.set('ad_astra:hydrogen')
            }
          }
        }
      }
    }
  }
}

function alterFuelAround(level, x, y, z){
    let target = level.getBlock(x+Math.floor(3*Math.random())-1, y+Math.floor(3*Math.random())-1, z+Math.floor(3*Math.random())-1);
    if(decay.hasOwnProperty(target.id)){
      if(Math.random()<=(1/decay[target.id].duration))target.set(decay[target.id].product);
    }
}

function explosionIfHydrogen(level, x, y, z){
  const range = 1;
  let i, j, k
  let hydrogenCounter = 0;
  let hydrogenPos = []
  for(i = x+range; i >= x-range; i--){
    for(j = y+range; j >= y-range; j--){
      for(k = z+range; k >= z-range; k--){
        let block = level.getBlock(i,j,k);
        if(block.id === 'ad_astra:hydrogen'){
          hydrogenPos.push([i,j,k]);
          hydrogenCounter++;
        }
      }
    }
  }
  if(hydrogenCounter > 25){
    hydrogenPos.forEach(pos=>{level.getBlock(pos).set('minecraft:soul_fire')})
    level.createExplosion(x,y,z).strength(20).explode()//.explosionMode('block')
  }
  else if(hydrogenCounter > 8){
    if(Math.random()<0.1){
      hydrogenPos.forEach(pos=>{
        level.getBlock(pos).set('minecraft:soul_fire')
      })
      level.createExplosion(x,y,z).strength(5).explosionMode('block').explode()
    }
  }
}

global.runningGasParticles = (entity) => {
    if(Math.random()<0.9){
      entity.level.addParticle('alexscaves:acid_bubble', true, entity.x-0.5+2*Math.random(), entity.y-0.5+2*Math.random(), entity.z-0.5+2*Math.random(), 0, -0.035, 0)
      if(Math.random()<0.3)entity.level.addParticle('alexscaves:raygun_explosion', true, entity.x-0.5+2*Math.random(), entity.y-0.5+2*Math.random(), entity.z-0.5+2*Math.random(), 0, 0, 0)
    }
}
