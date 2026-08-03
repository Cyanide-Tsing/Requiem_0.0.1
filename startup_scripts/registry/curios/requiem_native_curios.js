StartupEvents.registry('item', event=>{
    event.create('requiem:manual_of_brass')
        .maxStackSize(1)
        .rarity('alexscaves:rainbow')
        .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .canEquip((slotcontext, stack) => true)
                .canUnequip((slotcontext, stack) => true)
                .canDrop((slotContext, source, lootingLevel, recentlyHit, stack) => false)
                .addAttribute(
                    "minecraft:generic.max_health",
                    "requiem:manual_of_brass_base",
                    4,
                    'addition'
                )
                .addAttribute(
                    "minecraft:generic.movement_speed",
                    "requiem:manual_of_brass_base",
                    0.04,
                    'addition'
                )
                .addAttribute(
                    "forge:swim_speed",
                    "requiem:manual_of_brass_base",
                    0.2,
                    'addition'
                )
                .onEquip((slotContext, oldStack, newStack) => {
                    let player = slotContext.entity()
                    player.addCuriosSlotModifier('page', 'requiem:manual_of_brass_base', 5, 'addition')
                })
                .onUnequip((slotContext, oldStack, newStack) => {
                    let player = slotContext.entity()
                    player.addCuriosSlotModifier('page', 'requiem:manual_of_brass_base', 0, 'addition')
                })
                .curioTick((slotContext, stack) => {
                    let player = slotContext.entity();
                    if(player.age%60 === 0){
                        player.heal(1);
                    }
                })
                .modifyAttributesTooltip((tooltips, stack) => tooltips)
        )
    event.create('requiem:enigmatic_tome')
        .maxStackSize(1)
        .rarity('alexscaves:demonic')
        .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .canEquip((slotcontext, stack) => true)
                .canUnequip((slotcontext, stack) => true)
                .canDrop((slotContext, source, lootingLevel, recentlyHit, stack) => false)
                .addAttribute(
                    "minecraft:generic.armor",
                    "requiem:enigmatic_tome_base",
                    4,
                    'addition'
                )
                .addAttribute(
                    "minecraft:generic.attack_speed",
                    "requiem:enigmatic_tome_base",
                    0.1,
                    'addition'
                )
                .addAttribute(
                    "goety:soul_discount",
                    "requiem:enigmatic_tome_base",
                    0.1,
                    'addition'
                )
                .addAttribute(
                    "goety:spell_potency",
                    "requiem:enigmatic_tome_base",
                    0.1,
                    'addition'
                )
                .curioTick((slotContext, stack) => {
                    let player = slotContext.entity();
                    if(player.age%40 === 0){
                        player.heal(1);
                    }
                })
                .onEquip((slotContext, oldStack, newStack) => {
                    let player = slotContext.entity()
                    player.addCuriosSlotModifier('scroll', 'requiem:enigmatic_tome', 5, 'addition')
                })
                .onUnequip((slotContext, oldStack, newStack) => {
                    let player = slotContext.entity()
                    player.addCuriosSlotModifier('scroll', 'requiem:enigmatic_tome', 0, 'addition')
                })
                .modifyAttributesTooltip((tooltips, stack) => tooltips)
        )
})

//Pages
StartupEvents.registry('item', event=>{
    //Create LV 0
    event.create('requiem:page_of_spelunkery')
        .maxStackSize(1)
        .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .canEquip((slotcontext, stack) => true)
                .canUnequip((slotcontext, stack) => true)
                .canDrop((slotContext, source, lootingLevel, recentlyHit, stack) => false)
                .onEquip((slotContext, oldStack, newStack) => {})
                .onUnequip((slotContext, oldStack, newStack) => {})
                .curioTick((slotContext, stack) => {
                    slotContext.entity().potionEffects.add("minecraft:night_vision", 65, 0, false, false)
                })
                .addAttribute(
                    "attributeslib:mining_speed",
                    "requiem:page_of_spelunkery",
                    0.2,
                    "addition"
                )
                .modifyFortuneLevel((slotContext, lootContext, stack) => 3)
        )
        .tag('curios:page')

    event.create('requiem:page_of_clockwork')
        .maxStackSize(1)
        .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .canEquip((slotcontext, stack) => true)
                .canUnequip((slotcontext, stack) => true)
                .canDrop((slotContext, source, lootingLevel, recentlyHit, stack) => false)
                .onEquip((slotContext, oldStack, newStack) => {})
                .onUnequip((slotContext, oldStack, newStack) => {})
                .curioTick((slotContext, stack) => {
                    if(slotContext.entity().isSprinting())slotContext.entity().modifyAttribute("minecraft:generic.movement_speed", "requiem:poc_sprint", 0.05, "addition")
                    else slotContext.entity().modifyAttribute("minecraft:generic.movement_speed", "requiem:poc_sprint", 0, "addition")
                })
                .addAttribute("minecraft:generic.attack_speed", "requiem:page_of_clockwork", 0.1, "addition")
        )
        .tag('curios:page')
    
    event.create('requiem:page_of_vitality')
        .maxStackSize(1)
        .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .canEquip((slotcontext, stack) => true)
                .canUnequip((slotcontext, stack) => true)
                .canDrop((slotContext, source, lootingLevel, recentlyHit, stack) => false)
                .onEquip((slotContext, oldStack, newStack) => {})
                .onUnequip((slotContext, oldStack, newStack) => {})
                .curioTick((slotContext, stack) => {})
                .addAttribute(
                    "cataclysm:nature_heal", 
                    "requiem:page_of_vitality", 
                    0.15, 
                    "addition"
                )
        )
        .tag('curios:page')

    event.create('requiem:page_of_forged_iron')
        .maxStackSize(1)
        .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .canEquip((slotcontext, stack) => true)
                .canUnequip((slotcontext, stack) => true)
                .canDrop((slotContext, source, lootingLevel, recentlyHit, stack) => false)
                .onEquip((slotContext, oldStack, newStack) => {})
                .onUnequip((slotContext, oldStack, newStack) => {})
                .curioTick((slotContext, stack) => {
                    slotContext.entity().potionEffects.add("resistance", 30, 0, false, false)
                })
                .addAttribute(
                    "minecraft:generic.armor",
                    "requiem:page_of_forged_iron",
                    6,
                    "addition"
                )
        )
        .tag('curios:page')

    //Create LV 1
    event.create('requiem:page_of_alloying')
        .rarity('uncommon')
        .maxStackSize(1)
        .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .canEquip((slotcontext, stack) => true)
                .canUnequip((slotcontext, stack) => true)
                .canDrop((slotContext, source, lootingLevel, recentlyHit, stack) => false)
                .onEquip((slotContext, oldStack, newStack) => {})
                .onUnequip((slotContext, oldStack, newStack) => {})
                .curioTick((slotContext, stack) => {
                    slotContext.entity().potionEffects.add("resistance", 30, 0, false, false)
                })
                .addAttribute(
                    "minecraft:generic.armor",
                    "requiem:page_of_forged_iron",
                    8,
                    "addition"
                )
                .addAttribute(
                    "minecraft:generic.armor_toughness",
                    "requiem:page_of_forged_iron",
                    2,
                    "addition"
                )
        )
        .tag('curios:page')

    event.create('requiem:page_of_charged')
        .rarity('uncommon')
        .maxStackSize(1)
        .attachCapability(
            CapabilityBuilder.ENERGY.customItemStack()
                .canExtract(() => true)
                .canReceive(() => true)
                .getMaxEnergyStored(() => 20800)
                .extractEnergy((itemStack, amount, simulate) => {
                    if(!itemStack?.nbt) return 0;
                    if(!itemStack.nbt.contains('energy'))itemStack.nbt.putInt("energy", 0)
                    let energy = itemStack.nbt.getInt("energy")
                    let extracted = Math.min(energy, amount)
                    if (!simulate) {
                        itemStack.nbt.putInt("energy", energy - extracted)
                    }
                    return extracted
                })
                .receiveEnergy((itemStack, amount, simulate) => {
                    if(!itemStack?.nbt) return 0;
                    if(!itemStack.nbt.contains('energy'))itemStack.nbt.putInt("energy", 0)
                    let energy = itemStack.nbt.getInt("energy")
                    let received = Math.min(20800 - energy, amount)
                    if (!simulate) {
                        itemStack.nbt.putInt("energy", energy + received)
                    }
                    return received
                })
                .getEnergyStored(itemStack => {
                    if(!itemStack?.nbt) return 0;
                    return itemStack.nbt.getInt("energy")
                })
         )
         .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .canEquip((slotcontext, stack) => true)
                .canUnequip((slotcontext, stack) => true)
                .canDrop((slotContext, source, lootingLevel, recentlyHit, stack) => false)
                .onEquip((slotContext, oldStack, newStack) => {
                    let player = slotContext.entity()
                    if(newStack?.nbt && newStack.nbt.contains('energy'))
                    {
                        if(newStack.nbt.getInt('energy')>0){
                            player.modifyAttribute("minecraft:generic.movement_speed", "requiem:page_of_charge", 0.04, "addition")
                            player.modifyAttribute("minecraft:generic.attack_speed", "requiem:page_of_charge", 0.3, "addition")
                            player.modifyAttribute("minecraft:generic.flying_speed", "requiem:page_of_charge", 0.1, "addition")
                        }
                    }
                    else{
                        player.modifyAttribute("minecraft:generic.movement_speed", "requiem:page_of_charge", 0, "addition")
                        player.modifyAttribute("minecraft:generic.attack_speed", "requiem:page_of_charge", 0, "addition")
                    }
                })
                .curioTick((slotcontext, stack)=>{
                    if(slotcontext.entity().age%10 === 0)
                    if(stack?.nbt && stack?.nbt.getInt('energy')){
                        let amount = stack.nbt.getInt('energy')
                        stack.nbt.putInt('energy', amount-1)
                    }
                })
         )
         .barWidth(itemStack=>{
            if(itemStack?.nbt) return itemStack.nbt.contains('energy') ? itemStack.nbt.getInt('energy') / 1500 : 0;
            else return 0
         })
         .barColor(itemStack=>Color.AQUA)
          .tag("curios:page")

    event.create('requiem:page_of_radioactivity')
            .rarity('alexscaves:nuclear')
            .maxStackSize(1)
            .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .canEquip((slotcontext, stack) => true)
                .canUnequip((slotcontext, stack) => true)
                .canDrop((slotContext, source, lootingLevel, recentlyHit, stack) => false)
                .onEquip((slotContext, oldStack, newStack) => {})
                .onUnequip((slotContext, oldStack, newStack) => {})
                .curioTick((slotContext, stack) => {
                    if (!stack.nbt) return
                    if (!stack.nbt.contains('energy')) stack.nbt.putInt('energy', 16)
                    if (slotContext.entity().age % 100 === 0) {
                        stack.nbt.putInt('energy', Math.min(16, stack.nbt.getInt('energy') + 1))
                    }
                })
            )
            .barWidth(itemStack => {
                if(itemStack?.nbt) return itemStack.nbt.contains('energy') ? Math.floor(itemStack.nbt.getInt('energy') / 1.2) : 0;
                else return 0
            })
            .barColor(itemStack => Color.of(0x39FF14))
            .tag('curios:page')

    event.create('requiem:page_of_surging_health')
        .maxStackSize(1)
        .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .canEquip((slotcontext, stack) => true)
                .canUnequip((slotcontext, stack) => true)
                .canDrop((slotContext, source, lootingLevel, recentlyHit, stack) => false)
                .onEquip((slotContext, oldStack, newStack) => {})
                .onUnequip((slotContext, oldStack, newStack) => {})
                .curioTick((slotContext, stack) => {})
                .addAttribute(
                    "minecraft:generic.max_health", 
                    "requiem:page_of_surging_health", 
                    0.10, 
                    "multiply_base"
                )
                .addAttribute(
                    "cataclysm:nature_heal", 
                    "requiem:page_of_surging_health", 
                    0.10, 
                    "multiply_base"
                )
        )
        .tag('curios:page')

    //Create LV 2
    event.create('requiem:page_of_antigravity')
        .rarity('epic')
        .maxStackSize(1)
        .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .canEquip((slotcontext, stack) => true)
                .canUnequip((slotcontext, stack) => true)
                .canDrop((slotContext, source, lootingLevel, recentlyHit, stack) => false)
                .canWalkOnPowderedSnow((slotcontext, stack) => true)
                .addAttribute(
                    "attributeslib:creative_flight",
                    "requiem:page_of_antigravity",
                    1,
                    "addition"
                )
                .addAttribute(
                    "minecraft:generic.flying_speed",
                    "requiem:page_of_antigravity",
                    0.1,
                    "multiply_total"
                )
        ).tag("curios:page")

    event.create('requiem:page_of_infused_magnet')
            .rarity('epic')
            .maxStackSize(1)
            .attachCuriosCapability(
                CuriosJSCapabilityBuilder.create()
                    .canEquip((slotcontext, stack) => true)
                    .canUnequip((slotcontext, stack) => true)
                    .canDrop((slotContext, source, lootingLevel, recentlyHit, stack) => false)
                    .onEquip((slotContext, oldStack, newStack) => {})
                    .onUnequip((slotContext, oldStack, newStack) => {})
                    .curioTick((slotContext, stack) => {
                        if (!stack.nbt) return
                        if (!stack.nbt.contains('energy')) stack.nbt.putInt('energy', 16)
                        if (slotContext.entity().age % 100 === 0) {
                            stack.nbt.putInt('energy', Math.min(16, stack.nbt.getInt('energy') + 1))
                        }
                    })
          )
          .barWidth(itemStack => {
            if(itemStack?.nbt) return itemStack.nbt.contains('energy') ? Math.floor(itemStack.nbt.getInt('energy') / 1.2) : 0;
            else return 0
          })
          .barColor(itemStack => {
            if(itemStack?.nbt && itemStack.nbt.contains('energy')){
                let energy = itemStack.nbt.getInt('energy')
                return Color.rgba(240-energy*15, 0, 15*energy,0)
            }
            else return Color.of(0xffffff)})
          .tag('curios:page')
})