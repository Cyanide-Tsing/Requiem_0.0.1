ItemEvents.rightClicked('requiem:soulmeter', event=>{
    const {player} = event
    player.tell(Text.join([Text.translate('message.requiem.soul_power'), player.server.persistentData.getInt('soul_power')]))
})