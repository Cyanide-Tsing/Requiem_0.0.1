//const CoalGeneratorBlockEntity = Java.loadClass("earth.terrarium.adastra.common.blockentities.machines.CoalGeneratorBlockEntity");

let recipes = [
    {
        heat:'minecraft:lava',
        cool:'minecraft:basalt',
        thermalEnergy: 10000
    },
    {
        heat:'minecraft:magma_block',
        cool:'minecraft:netherrack',
        thermalEnergy: 100
    },
    {
        heat:'hotbath:hot_water_block',
        cool:'minecraft:water',
        thermalEnergy: 19000
    },
    {
        heat:'createbigcannons:molten_cast_iron',
        cool:'createbigcannons:cast_iron_block',
        thermalEnergy: 58000
    },
    {
        heat:'createbigcannons:molten_steel',
        cool:'ad_astra:steel_block',
        thermalEnergy: 74000
    }
]

let machines = [
    'ad_astra:coal_generator',
    'kubejs:turbine'
]

let volatile = {
    'minecraft:wet_sponge':{
        output: 'minecraft:sponge',
        itemPop: 'minecraft:air',
        amount: 1,
        vapour: 'minecraft:water',
        chance: 1.00,
        energyConsume: 10
    },
    'minecraft:honeycomb_block':{
        output: 'createloveandwar:ethylene_block',
        itemPop: 'minecraft:air',
        amount: 1,
        vapour: 'create:honey',
        chance: 1.00,
        energyConsume: 100
    },
    'minecraft:water':{
        output: 'hotbath:hot_water_block',
        itemPop: 'minecraft:air',
        amount: 1,
        vapour: 'minecraft:air',
        chance: 1.00,
        energyConsume: 100
    },
    'alexscaves:galena':{
        output: 'minecraft:air',
        itemPop: 'kubejs:lead_ingot',
        amount: 1,
        vapour: 'createloveandwar:raw_sulphur_block',
        chance: 1.00,
        energyConsume: 500
    },
    'alexscaves:packed_galena':{
        output: 'kubejs:lead_block',
        itemPop: 'createloveandwar:sulphur',
        amount: 9,
        vapour: 'createloveandwar:sulphur_block',
        chance: 1.00,
        energyConsume: 4500
    },
    'createloveandwar:raw_sulphur_block':{
        output: 'minecraft:air',
        itemPop: 'minecraft:air',
        amount: 1,
        vapour: 'createloveandwar:sulphur_block',
        chance: 0.25,
        energyConsume: 100
    },
    'quark:gunpowder_sack':{
        output: 'quark:charcoal_block',
        itemPop: 'createbigcannons:hardened_nitro',
        amount: 9,
        vapour: 'createloveandwar:sulphur_block',
        chance: 1.00,
        energyConsume: 100
    },
    'kubejs:potent_sulfur':{
        output: 'kubejs:potent_sulfur',
        itemPop: 'minecraft:air',
        amount: 1,
        vapour: 'createloveandwar:sulphur_block',
        chance: 0.10,
        energyConsume: 100
    }
}

let count = 0
let energy = 0
let energy_inside

global.doThermalExchange = (entity) => {
    count++;
    //if(count%11 !== 0)return entity.data.thermalEnergy;
    //if(readMachine(entity).id === 'ad_astra:coal_generator'){entity.block.level.server.runCommandSilent('/data merge block '+entity.x+' '+(entity.y+1)+' '+entity.z+' {CookTimeTotal: 19200}');}
    if(recipes.some(recipes => recipes.heat === readNeighbor(entity).id)){
        if(checkIfFlowing(readNeighbor(entity)))return;
        let recipe = recipes.find(r => r.heat === readNeighbor(entity).id)
        readNeighbor(entity).set(recipe.cool);
        entity.data.merge({thermalEnergy: (entity.data.thermalEnergy + recipe.thermalEnergy)})  
    }

    if(machines.includes(readMachine(entity).id)){
        let pos = entity.level.getBlock(entity.x,entity.y+1,entity.z).getPos();
        let machine = entity.level.getBlockEntity(pos);
        if(readMachine(entity).id === 'ad_astra:coal_generator'){
            let currentCookTime = machine.cookTime()
            energy = entity.data.thermalEnergy/10;
            entity.block.level.server.runCommandSilent('/data merge block '+entity.x+' '+(entity.y+1)+' '+entity.z+' {CookTime: '+(energy/20+currentCookTime)+'}')
            entity.data.merge({thermalEnergy: (entity.data.thermalEnergy - energy)})
        }
        if(readMachine(entity).id === 'kubejs:turbine'){
            let energyStorage = machine.getCapability(ForgeCapabilities.ENERGY).resolve().orElse(null);
            let currentEnergy = energyStorage.getEnergyStored()
            if(currentEnergy < 32767){
                let transferAmount = Math.min(entity.data.thermalEnergy / 15, 32767 - currentEnergy);
                let received = energyStorage.receiveEnergy(transferAmount, false);
                if (received > 0) {
                    entity.data.merge({ thermalEnergy: entity.data.thermalEnergy - received});
                }
            }
        }
    }

    if(volatile.hasOwnProperty(readMachine(entity).id)){
        let input = readMachine(entity);
        if(entity.data.thermalEnergy >= volatile[input.id].energyConsume){
            if(Math.random()<=volatile[input.id].chance){
                if(volatile[input.id].itemPop !== 'minecraft:air') input.popItem(Item.of(volatile[input.id].itemPop,volatile[input.id].amount));
                if(findTop(entity) !== null && volatile[input.id].vapour !== 'minecraft:air')findTop(entity).set(volatile[input.id].vapour);
                entity.data.merge({thermalEnergy: (entity.data.thermalEnergy - volatile[input.id].energyConsume)})
            }
            input.set(volatile[input.id].output)
        }
    }
}

global.runningParticles = (entity) => {
    if(Math.random()<0.0133){
        entity.level.addParticle('minecraft:campfire_cosy_smoke', true, entity.x+0.5, entity.y+1.05, entity.z+0.5, 0, 0.05, 0)
    }
}

function readNeighbor(entity){
    return entity.level.getBlock(entity.x,entity.y-1,entity.z);
}

function readMachine(entity){
    return entity.level.getBlock(entity.x,entity.y+1,entity.z);
}

function checkIfFlowing(block){
    if(!block.toString().match('level='))return false;
    let level = block.toString().split('=')[1].split(']')[0]
    if(level === '0')return false;
    else return true;
}

function findTop(entity){
    var i = 2, y = 320;
    for(i = 2; i <= 5; i++){
        if(entity.level.getBlock(entity.x,entity.y+i,entity.z) === 'kubejs:thermal_exchanger') y = Math.min(y, entity.y+i);
    }
    if( y !== 320) return entity.level.getBlock(entity.x,y-1,entity.z);
    else return null;
}

//let pos = entity.level.getBlock(entity.x,entity.y+1,entity.z).getPos();
                //let machine = entity.level.getBlockEntity(pos);
                //console.log(`Machine:${machine.toString()}`)
                //console.log(`nbt: ${machine.persistentData.toString()}`)
                //machine.persistentData.push({CookTimeTotal: 19200});
                //machine.persistentData.push({CookTime: 1590});
                //console.log(`Server:${entity.server.toString()}`)
                        //console.log(`[2f]${readNeighbor(entity).id}`)