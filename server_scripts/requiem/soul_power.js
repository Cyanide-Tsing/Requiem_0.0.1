ServerEvents.commandRegistry(event => {
    const { commands, arguments: args } = event

    event.register(
        commands.literal('soul_power')
            .executes(ctx => {
                ctx.source.sendSuccess(Text.of('soul_power = ' + ctx.source.server.persistentData.getInt('soul_power')), false)
                return 1
            })
            .then(commands.argument('value', args.INTEGER.create(event))
                .executes(ctx => {
                    let value = args.INTEGER.getResult(ctx, 'value')
                    ctx.source.server.persistentData.putInt('soul_power', value)
                    ctx.source.sendSuccess(Text.of('soul_power = ' + value), false)
                    return 1
                }))
    )
})

PlayerEvents.loggedIn(event=>{
    if(event.player.server.persistentData.getInt('soul_power') == undefined) event.player.server.persistentData.putInt('soul_power', Math.floor(45000 + 10000 * Math.random()))
})

EntityEvents.death(event=>{
    const {entity} = event
    if(entity.type == 'minecraft:villager' || entity.type == 'minecraft:wandering_trader' || entity.type == 'goety:prisoner'){
        alterSoulPower(entity.server, 10)
    }
    else{
        alterSoulPower(entity.server, 2)
    }
})

function alterSoulPower(server, i){
    return server.persistentData.putInt('soul_power', server.persistentData.getInt('soul_power') + i)
}