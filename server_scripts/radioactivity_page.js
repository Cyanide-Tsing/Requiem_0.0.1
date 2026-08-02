
/*
const RADIOACTIVITY_PAGE = 'requiem:page_of_radioactivity'
const RADIOACTIVITY_RADIUS = 6

function getRadioactivityPage(player) {
    return global.radioactivityPages?.[player.uuid] ?? null
}

function applyRadioactivityPulse(player) {
    let page = getRadioactivityPage(player)
    if (!page) return

    if (!page.nbt) return
    if (!page.nbt.contains('energy')) page.nbt.putInt('energy', 16)
    let energy = page.nbt.getInt('energy')
    if (energy <= 0) return
    page.nbt.putInt('energy', energy - 1)

    let level = player.level
    try {
        let pulse = level.createEntity('cataclysm:emp')
        if (pulse) {
            pulse.setPosition(player.x, player.y + 1, player.z)
            pulse.spawn()
        }
    } catch (error) {
        console.error('Could not spawn cataclysm:emp: ' + error)
    }

    level.getEntities().forEach(target => {
        if (!target || target === player || !target.isLiving()) return
        let dx = target.x - player.x
        let dy = target.y - player.y
        let dz = target.z - player.z
        if (dx * dx + dy * dy + dz * dz > RADIOACTIVITY_RADIUS * RADIOACTIVITY_RADIUS) return

        target.potionEffects.add('alexscaves:irradiated', 400, 0, false, true)
        target.attack(level.damageSources().playerAttack(player), 5)
    })
}

NetworkEvents.dataReceived('requiem_radioactivity_pulse', event => {
    applyRadioactivityPulse(event.player)
})
*/