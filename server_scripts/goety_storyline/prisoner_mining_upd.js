let count = 0

ServerEvents.tick(event => {
    count++
    if (count % 20 !== 0) return
    count = 0

    event.server.entities.forEach(entity => {
        if (entity.type !== 'goety:prisoner') return
        if (entity.mainHandItem.id === 'kubejs:pale_metal_pickaxe') {
            entity.potionEffects.add('minecraft:haste', 40, 1, false, false)
        }
    })
})
