StartupEvents.registry('item', event=>{
    event.create('soul_powered:pale_metal_pickaxe', "pickaxe")
        .tier('diamond')
        .attackDamageBaseline(1)
        .attackDamageBonus(1)
        .maxDamage(250)
        .glow(true)

    event.create('ominous_cannoli').maxStackSize(16)
        .food(food =>{
            food.hunger(5)
                .effect('minecraft:bad_omen', 5000, 4, 1)
                .saturation(1)
                .alwaysEdible()
                .fastToEat()
            }
        );
})