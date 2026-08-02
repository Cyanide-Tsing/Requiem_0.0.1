const EMP_RADIUS = 5
const RAD_RADIUS = 3

function findCurioPage(player, itemId) {
    let found = player.curiosInventory["findFirstCurio(net.minecraft.world.item.Item)"](Item.of(itemId))
    if (!found.isPresent()) return null
    return found.get().stack()
}

const specialPageEffects = {
    'requiem:page_of_vitality': function (level, player) {
        let page = findCurioPage(player, "requiem:page_of_vitality")
        if (player.getCooldowns().isOnCooldown(page)) return;
        for(let i=0; i<5; i++){
            level.runCommandSilent(`particle minecraft:heart ${player.x + 2*Math.random() - 1} ${player.y+1} ${player.z + 2*Math.random() - 1}`)
        }
        player.heal(5)
        player.addItemCooldown(page, 200)
    },
    /**
     * @param {Internal.Level} level
     * @param {Internal.Player} player
     */
    'requiem:page_of_radioactivity': function (level, player) {
        let page = findCurioPage(player, "requiem:page_of_radioactivity")
        if (!page?.nbt || page.nbt.getInt("energy") <= 0 || player.getCooldowns().isOnCooldown(page)) return;
        for(let i=0; i<10; i++){
            level.runCommandSilent(`particle alexscaves:blue_raygun_explosion ${player.x + 4*Math.random() - 2} ${player.y + 0.5} ${player.z + 4*Math.random() - 2}`)
            level.runCommandSilent(`particle alexscaves:raygun_explosion ${player.x + 6*Math.random() - 3} ${player.y + 0.5} ${player.z + 6*Math.random() - 3}`)
            level.runCommandSilent(`particle alexscaves:raygun_explosion ${player.x + 6*Math.random() - 3} ${player.y + 0.5} ${player.z + 6*Math.random() - 3}`)
            level.runCommandSilent(`particle alexscaves:raygun_explosion ${player.x + 6*Math.random() - 3} ${player.y + 0.5} ${player.z + 6*Math.random() - 3}`)
        }
        player.addItemCooldown(page, 40)
        let energy = page.nbt.getInt("energy")
        page.nbt.putInt("energy", energy-1)
        level.getEntities().forEach(target => {
            if (!target || target.uuid === player.uuid || !target.isLiving()) return
            let dx = target.x - player.x
            let dy = target.y - player.y
            let dz = target.z - player.z
            if (dx * dx + dy * dy + dz * dz > RAD_RADIUS * RAD_RADIUS) return

            target.potionEffects.add('alexscaves:irradiated', 100, 4, false, false)
            target.attack(level.damageSources().explosion(target, player), 15)
        })
    },
    /**
     * @param {Internal.Level} level
     * @param {Internal.Player} player
     */
    'requiem:page_of_infused_magnet': function (level, player) {
        let page = findCurioPage(player, "requiem:page_of_infused_magnet")
        if (!page?.nbt || page.nbt.getInt("energy") <= 0 || player.getCooldowns().isOnCooldown(page)) return;
        level.runCommandSilent(`particle cataclysm:em_pulse ${player.x} ${player.y+1} ${player.z}`)
        level.runCommandSilent(`particle alexscaves:scarlet_shield_lightning ${player.x} ${player.y+1} ${player.z} 1 1 1 0 1 normal`)
        level.runCommandSilent(`particle alexscaves:azure_shield_lightning ${player.x} ${player.y+1} ${player.z} -1 1 -1 0 1 normal`)
        player.addItemCooldown(page, 40)
        let energy = page.nbt.getInt("energy")
        page.nbt.putInt("energy", energy-1)
        level.getEntities().forEach(target => {
            if (!target || target.uuid === player.uuid || !target.isLiving()) return
            let dx = target.x - player.x
            let dy = target.y - player.y
            let dz = target.z - player.z
            if (dx * dx + dy * dy + dz * dz > EMP_RADIUS * EMP_RADIUS) return

            target.potionEffects.add('alexscaves:stunned', 60, 0, false, false)
            target.attack(level.damageSources().playerAttack(player), 1)
            target.attack(level.damageSources().lightningBolt(), 10)
        })
    }
}

function paintSpecialPagesHUD(player) {
    if (!player.persistentData.contains("active_index")) return
    let activeIndex = player.persistentData.getInt("active_index")

    let equippedPages = []
    for (let i = 0; i < global.SPECIAL_PAGE_IDS.length; i++) {
        let id = global.SPECIAL_PAGE_IDS[i]
        let found = player.curiosInventory["findFirstCurio(net.minecraft.world.item.Item)"](Item.of(id))
        if (found.isPresent()) {
            let stack = found.get().stack()
            let energy = 0, maxEnergy = 0, energyText = '', energyColor = '#FFFFFF', showEnergy = false
            if (stack.nbt && stack.nbt.contains('energy')) {
                maxEnergy = (global.SPECIAL_PAGE_MAX_ENERGY || {})[id] || 0
                if (maxEnergy > 0) {
                    energy = stack.nbt.getInt('energy')
                    energyText = energy + '/' + maxEnergy
                    showEnergy = true
                    if (energy >= maxEnergy) energyColor = '#55FF55'
                    else if (energy <= maxEnergy / 4) energyColor = '#FF5555'
                }
            } else {
                energyText = 'CHARGED'
                energyColor = '#55FF55'
                showEnergy = true
            }
            equippedPages.push({ id: id, energyText: energyText, energyColor: energyColor, showEnergy: showEnergy })
        }
    }

    let paintData = {}
    let boxH = 18, gap = 2, baseX = 5

    for (let i = 0; i < equippedPages.length; i++) {
        let page = equippedPages[i]
        let isActive = (i === activeIndex)
        let yOff = 5 + i * (boxH + gap)

        paintData['sp_bg_' + i] = {
            type: 'rectangle',
            x: baseX, y: -yOff, w: 90, h: boxH,
            color: isActive ? '#B0606060' : '#80000000',
            alignX: 'left', alignY: 'bottom',
            draw: 'ingame',
            visible: true
        }
        paintData['sp_item_' + i] = {
            type: 'item',
            x: 14, y: -(yOff - 7),
            item: page.id,
            overlay: true,
            alignX: 'left', alignY: 'bottom',
            draw: 'ingame',
            visible: true
        }
        paintData['sp_text_' + i] = {
            type: 'text',
            x: 30, y: -(yOff + 2),
            text: page.energyText,
            color: page.energyColor,
            alignX: 'left', alignY: 'bottom',
            draw: 'ingame',
            visible: page.showEnergy
        }
    }

    for (let i = equippedPages.length; i < global.SPECIAL_PAGE_IDS.length; i++) {
        paintData['sp_bg_' + i] = { visible: false }
        paintData['sp_item_' + i] = { visible: false }
        paintData['sp_text_' + i] = { visible: false }
    }

    player.paint(paintData)
}

NetworkEvents.dataReceived("global.burnKey.consumeClick", (event) => {
    let player = event.player
    if (!player.persistentData.contains("active_index")) player.persistentData.putInt("active_index", -1)
    let activePages = []
    for (let i = 0; i < global.SPECIAL_PAGE_IDS.length; i++) {
        let page = global.SPECIAL_PAGE_IDS[i]
        if (player.isCuriosEquipped(Item.of(page))) activePages.push(page)
    }
    if (player.persistentData.getInt("active_index") === -1 && activePages.length > 0) player.persistentData.putInt("active_index", 0)
    let index = player.persistentData.getInt("active_index")
    if (index >= 0 && index < activePages.length) {
        specialPageEffects[activePages[index]](event.level, player)
    } else if (activePages.length > 0) {
        player.persistentData.putInt("active_index", 0)
    }
    paintSpecialPagesHUD(player)
});

NetworkEvents.dataReceived("global.prevKey.consumeClick", (event) => {
    let player = event.player
    if (!player.persistentData.contains("active_index")) player.persistentData.putInt("active_index", -1)
    let activePages = []
    for (let i = 0; i < global.SPECIAL_PAGE_IDS.length; i++) {
        let page = global.SPECIAL_PAGE_IDS[i]
        if (player.isCuriosEquipped(Item.of(page))) activePages.push(page)
    }
    if (player.persistentData.getInt("active_index") === -1 && activePages.length > 0) player.persistentData.putInt("active_index", 0)
    let index = player.persistentData.getInt("active_index")
    if (index >= 0 && index < activePages.length) {
        player.persistentData.putInt("active_index", (index + activePages.length - 1) % activePages.length)
    } else if (activePages.length > 0) {
        player.persistentData.putInt("active_index", 0)
    }
    paintSpecialPagesHUD(player)
})

PlayerEvents.loggedIn(event => {
    let player = event.player
    if (!player.persistentData.contains("active_index")) player.persistentData.putInt("active_index", -1)
    paintSpecialPagesHUD(player)
})

PlayerEvents.tick(event => {
    let player = event.player
    if (player.age % 20 !== 0) return
    paintSpecialPagesHUD(player)
})
/*
let page = player.curiosInventory["findFirstCurio(net.minecraft.world.item.Item)"](Item.of("requiem:page_of_radioactivity")).get().stack()
    if(!page?.nbt || page.nbt.getInt("energy") <= 0) return;
    let level = event.level;
    //level.addParticle("cataclysm:em_pulse", true, player.x, player.y, player.z, 0, 0, 0)
    level.runCommandSilent(`particle cataclysm:em_pulse ${player.x} ${player.y+1} ${player.z}`)
    player.runCommandSilent(`particle alexscaves:scarlet_shield_lightning ~ ~ ~ ~1 ~1 ~1 0 10 normal`)
    player.runCommandSilent(`particle alexscaves:azure_shield_lightning ~ ~ ~ ~-1 ~1 ~-1 0 10 normal`)
    //let EMP = level.createEntity("cataclysm:")
*/