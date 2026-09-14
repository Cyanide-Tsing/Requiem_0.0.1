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
    let hp = event.entity.getMaxHealth() * factor
    event.entity.setAttributeBaseValue($Attributes.MAX_HEALTH, hp)
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