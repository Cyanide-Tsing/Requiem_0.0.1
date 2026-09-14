/*
    Follows the following principle:
    factor = 1.01 ^ (sp - 50000)
    hp *= factor
    atk *= factor
    10% summon necromacer instead of zombie when sp > 100000
*/

const $Attributes = Java.loadClass('net.minecraft.world.entity.ai.attributes.Attributes')

EntityEvents.spawned(event=>{
    if(!event.entity.isLiving()) return;
    let sp = event.server.persistentData.getInt("soul_power")
    let factor = Math.pow(1.01, (sp - 50000) / 100)
    let factor_b = Math.pow(1.01, sp / 1000) - 0.65
    let maxHP = event.entity.getMaxHealth()
    let ATK = event.entity.getAttributeBaseValue($Attributes.ATTACK_DAMAGE)
    //console.log(ATK)
    let hp = Math.max(maxHP * factor, maxHP * factor_b)
    //console.log(`${factor},${factor_b}, ${hp}, ${maxHP}`)
    event.entity.setAttributeBaseValue($Attributes.MAX_HEALTH, hp)
    event.entity.setAttributeBaseValue($Attributes.ATTACK_DAMAGE, Math.max((ATK+1)*factor, ATK/5))
    event.entity.heal(hp)
    if(sp < 1000)event.entity.mergeNbt({ NoAI: true }) // oh shit WHAT IS IT
})

ItemEvents.entityInteracted(event=>{
    const {player} = event
    let entity = event.getTarget()
    if(player.mainHandItem.id == 'requiem:soul_fragment' && entity.getNbt().getBoolean("NoAI") && player.isCrouching()){
        entity.mergeNbt({ NoAI: false })
        player.mainHandItem.shrink(1)
    }
})