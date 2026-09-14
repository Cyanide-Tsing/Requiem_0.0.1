/*
    Follows the following principle:
    factor = 1.01 ^ (sp - 50000)
    hp *= factor
    atk *= factor
    10% summon necromacer instead of zombie when sp > 100000
*/

EntityEvents.spawned(event=>{
    if(!event.entity.isLiving()) return;
    let sp = event.server.persistentData.getInt("soul_power")
    let factor = Math.pow(1.01, (sp - 50000) / 100)
    let hp = event.entity.getMaxHealth() * factor
    event.entity.setMaxHealth(hp)
    event.entity.setHealth(hp)
    if(sp < 1000){
        event.entity.nbt.merge("{NoAI:1.0b}") // Working on removing AI when SP too low. Commands success
        event.server.getPlayerList().getPlayers().forEach(player=>player.tell('noAI operation success'))
    }
})