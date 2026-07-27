/*
StartupEvents.registry('item', event=>{
    event.create('wordcard')
    event.create('creative_dictionary').maxStackSize(1);
    event.create('makeshift_notebook').maxStackSize(1);
    event.create('writable_wordcard').maxDamage(6);
    event.create('scratch_scroll').maxStackSize(1);
    event.create('wand').useAnimation('block').use((level, player, hand) => true).useDuration(itemstack => 10).maxStackSize(1);
    event.create('dictionary').rarity('rare').unstackable()
    .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .curioTick((slotContext, stack) => {
                    let player = slotContext.entity();
                    if(stack.nbt?.Words.length>31){
                        if(player.age%10 === 0){
                            player.heal(stack.nbt?.Words.length/32 ?? 0);
                        }
                    }
                })
                .canEquip((slotContext, stack) => true)
                .canUnequip((slotContext, stack) => true)
                .canDrop((slotContext, source, lootingLevel, recentlyHit, stack) => false)
                .onEquip((slotContext, oldStack, newStack) => {
                    let player = slotContext.entity()
                    let amount = Math.floor(newStack.nbt?.Words.length/10) ?? 0
                    player.modifyAttribute("generic.max_health", "kubejs:curio_hp_bonus", amount, "addition");
                    player.modifyAttribute("generic.movement_speed", "kubejs:curio_speed_reduction", -amount/250, "multiply_total");
                    player.modifyAttribute("generic.attack_speed", "kubejs:curio_attack_speed_reduction", -amount/500, "addition");
                })
                .onUnequip((slotContext, oldStack, newStack) => {
                    let player = slotContext.entity()
                    player.modifyAttribute("generic.max_health", "kubejs:curio_hp_bonus", 0, "addition");
                    player.modifyAttribute("generic.movement_speed", "kubejs:curio_speed_reduction", 0, "addition");
                    player.modifyAttribute("generic.movement_speed", "kubejs:curio_attack_speed_reduction", 0, "addition");
                    player.attack(player.level.damageSources().magic(), 3)
                })
                .addAttribute(
                    "minecraft:generic.max_health",
                    "health_dictionary_total",
                    0.1,
                    'multiply_total'
                )
                .addAttribute(
                    "minecraft:generic.armor",
                    "dictionary_is_a_thick_book",
                    1,
                    'addition'
                )
                .addAttribute(
                    "minecraft:generic.knockback_resistance",
                    "dictionary_is_a_thick_book",
                    0.1,
                    'multiply_total'
                )
                .addAttribute(
                    "minecraft:generic.movement_speed",
                    "speed_down_dictionary",
                    -0.05,
                    'multiply_total'
                )
                .addAttribute(
                    "minecraft:generic.attack_speed",
                    "speed_down_dictionary",
                    -0.03,
                    'multiply_total'
                )
                .modifyAttributesTooltip((tooltips, stack) => tooltips)
                .modifyFortuneLevel((slotContext, lootContext, stack) => 0)
                .modifyLootingLevel((slotContext, source, target, baseLooting, stack) => 0)
                .makesPiglinsNeutral((slotContext, stack) => false)
                .canWalkOnPowderedSnow((slotContext, stack) => false)
                .isEnderMask((slotContext, enderMan, stack) => false));
})
*/