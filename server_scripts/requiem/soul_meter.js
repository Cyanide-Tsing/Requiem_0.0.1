ItemEvents.rightClicked('requiem:soulmeter', event=>{
    const {player} = event
    player.tell(Text.translate('message.requiem.soul_power')+player.server.persistentData.getInt('soul_power'))
})