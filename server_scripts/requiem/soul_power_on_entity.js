/*
    Follows the following principle:
    factor = 1.01 ^ (sp - 50000)
    hp *= factor
    atk *= factor
    10% summon necromacer instead of zombie when sp > 100000 - wip
    use soul fragment to recover AI
*/

const $Attributes = Java.loadClass('net.minecraft.world.entity.ai.attributes.Attributes')

const transmutableMap = [
    {
        initial:"minecraft:skeleton",
        final:"goety:necromancer",
        chance: 0.8
    },
    {
        initial:"minecraft:stray",
        final:"goety:cairn_necromancer",
        chance: 0.75
    },
    {
        initial:"minecraft:wither_skeleton",
        final:"goety:wither_necromancer",
        chance: 0.3
    },
    {
        initial:"minecraft:drowned",
        final:"goetyawaken:hostile_drowned_necromancer",
        chance: 0.8
    },
    {
        initial:"goetyawaken:parched",
        final:"goetyawaken:parched_necromancer",
        chance: 0.3
    },
    {
        initial:"goety:wraith",
        final:"goetyawaken:wraith_necromancer",
        chance: 0.4
    },
    {
        initial:"minecraft:spider",
        final:"goety:brood_mother",
        chance: 0.6
    },
    {
        initial:"goety:web_spider",
        final:"goety:brood_mother",
        chance: 0.85
    }
]

EntityEvents.spawned(event=>{
    if(!event.entity.isLiving()) return;
    if(event.entity.isPlayer()) return;
    let sp = event.server.persistentData.getInt("soul_power")
    let factor = Math.pow(1.01, (sp - 50000) / 100)
    let factor_b = Math.pow(1.01, sp / 1000) - 0.65
    let X =  sp / 3500
    let armor_factor = 16*Math.sqrt(X)*(Math.log(X/5)-1)
    let armor_toughness_factor = 8*Math.sqrt(X)*(Math.log(X/5)-1)
    let maxHP = event.entity.getMaxHealth()
    //console.log(ATK)
    let hp = Math.floor(Math.max(maxHP * factor, maxHP * factor_b))
    //console.log(`${factor},${factor_b}, ${hp}, ${maxHP}`)
    event.entity.setAttributeBaseValue($Attributes.MAX_HEALTH, hp)
    let ARM = event.entity.getAttributeBaseValue($Attributes.ARMOR)
    console.log(ARM, armor_factor*(ARM+1), event.entity.type)
    let ARMT = event.entity.getAttributeBaseValue($Attributes.ARMOR_TOUGHNESS)
    console.log(ARMT, armor_toughness_factor*(ARMT+1), event.entity.type)
    event.entity.setAttributeBaseValue($Attributes.ARMOR, Math.floor(Math.max(armor_factor*(ARM+1), ARM)))
    event.entity.setAttributeBaseValue($Attributes.ARMOR_TOUGHNESS, Math.floor(Math.max(armor_toughness_factor*(ARMT+1), ARMT)))
    event.entity.heal(hp)
    if(event.entity.isMonster()){
        let ATK = event.entity.getAttributeBaseValue($Attributes.ATTACK_DAMAGE)
        event.entity.setAttributeBaseValue($Attributes.ATTACK_DAMAGE, Math.max((ATK+1)*factor, ATK/5))
    }
    if(sp < 10000)event.entity.mergeNbt({ NoAI: true }) // oh shit it's in nbt but not in persistent data
})

EntityEvents.spawned(event=>{
    let entity = event.entity
    transmutableMap.forEach(option=>{
        if(option.initial == entity.type && event.server.persistentData.getInt("soul_power") > 57200 && Math.random() < option.chance){
            let transmutation = event.level.createEntity(option.final)
            transmutation.setPos(entity.x, entity.y, entity.z)
            entity.setPos(entity.x, -128, entity.z)
            entity.kill()
            transmutation.spawn()
        }
    })
})

ItemEvents.entityInteracted(event=>{
    const {player} = event
    let entity = event.getTarget()
    if(player.mainHandItem.id == 'requiem:soul_fragment' && entity.getNbt().getBoolean("NoAI") && player.isCrouching()){
        entity.mergeNbt({ NoAI: false })
        player.mainHandItem.shrink(1)
    }
})