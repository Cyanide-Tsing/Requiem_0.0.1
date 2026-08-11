BlockEvents.rightClicked(event => {
    if (event.block.id !== 'kubejs:demon_core') return
    if (event.player.mainHandItem.id !== 'kubejs:atomic_catalyst') return
    //event.cancel()
    let opp = event.facing.opposite
    let bx = event.block.x + 0.5 + opp.x * 0.55
    let by = event.block.y + 0.5 + opp.y * 0.55
    let bz = event.block.z + 0.5 + opp.z * 0.55
    let $Vec3 = Java.loadClass('net.minecraft.world.phys.Vec3')
    let particle = event.level.createEntity('kubejs:alpha_particle')
    particle.setPosition(bx, by, bz)
    particle.setDeltaMovement(new $Vec3(opp.x * 0.05, opp.y * 0.05, opp.z * 0.05))
    particle.spawn()
})
