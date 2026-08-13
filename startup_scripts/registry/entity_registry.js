StartupEvents.registry('entity_type', event => {
    let shouldRm = false;
    event.create('gas_grenade', 'entityjs:projectile')
        .clientTrackingRange(16)
        .isAttackable(false)
        .mobCategory('misc')
        .item(item => {
            item.tooltip(Text.translate("item.kubejs.gas_grenade.tooltip")).useAnimation('spear').useDuration(itemstack => 64).use((level, player, hand) => true).maxStackSize(16).texture("kubejs:item/chlorine_grenade").canThrow(true)
        })
        .sized(1, 1)
        .renderOffset(0, 0, 0)
        .renderScale(1, 1, 1)
        .updateInterval(3)
        .shouldRenderAtSqrDistance(context => {
            const { entity, distanceToPlayer } = context;
            return distanceToPlayer < 30;
        })
        .move(context => {
            const { entity, moverType, position } = context;
            entity.setDeltaMovement(0, 0.3, 0);
        })
        .onHitBlock(context => {
            const { entity, result } = context;
            entity.getLevel().createExplosion(entity.x, entity.y, entity.z).strength(1).explode();
            let gasCloud = entity.level.createEntity('createbigcannons:gas_cloud');
            gasCloud.setPosition(entity.x+2*(Math.random()-0.5), entity.y+2*Math.random(), entity.z+2*(Math.random()-0.5))
            gasCloud.setMotion(2*(Math.random()-0.5), 1.0, 2*(Math.random()-0.5))
            gasCloud.mergeNbt({
                Potion: "kubejs:suffocate",
                Duration: 64,
                WaitTime: 20,
                ReapplicationDelay: 5,
                Color: 13172480,
                Size: [8.0, 8.0, 8.0]
            });
            gasCloud.spawn()
            try{entity.remove('discarded');}
            catch(e){shouldRm = true;};
        })
        .onHitEntity(context => {
            const { entity, result } = context;
            if (result.entity.living) {
                let potion = result.entity.potionEffects
                potion.add('alexscaves:stunned', 200, 1, false, true)
                potion.add('minecraft:blindness', 200, 0, false, true)
            }
            entity.getLevel().createExplosion(entity.x, entity.y, entity.z).strength(1).explode();
            let gasCloud = entity.level.createEntity('createbigcannons:gas_cloud');
            gasCloud.setPosition(entity.x+2*(Math.random()-0.5), entity.y+2+4*Math.random(), entity.z+2*(Math.random()-0.5))
            gasCloud.setMotion(2*(Math.random()-0.5), 1.0, 2*(Math.random()-0.5))
            gasCloud.mergeNbt({
                Potion: "kubejs:suffocate",
                Duration: 64,
                WaitTime: 20,
                ReapplicationDelay: 5,
                Color: 13172480,
                Size: [8.0, 8.0, 8.0]
            });
            gasCloud.spawn()
            try{entity.remove('discarded');}
            catch(e){shouldRm = true;};
        })
        .tick(entity => {
            if (entity.getLevel().getBlockState(entity.blockPosition()).getBlock().id == "minecraft:lava") {
                entity.setSecondsOnFire(5);
            }
            if(shouldRm)entity.remove();
        })

        event.create('alpha_particle', 'entityjs:projectile')
            .sized(0.60, 0.60)
            .canCollideWith((ctx) => {return true})
            .canBeCollidedWith((ctx) => {return true})
            .canSpawnFarFromPlayer(true)
            .clientTrackingRange(64)
            .isPushable(true)
            .isFlapping(entity=>{return true})
            .mobCategory('misc')
            .updateInterval(3)
            .onHitBlock(context => {
                const { entity, result } = context
                global.onHitBehavior(entity, result)
            })
            .shouldRenderAtSqrDistance(context => {
                const { entity, distanceToPlayer } = context;
                return distanceToPlayer < 127;
            })
            .onHitEntity(context => {
                const { entity, result } = context
                if (result.entity.living) {
                    result.entity.attack(entity.level.damageSources().lightningBolt(), 4)
                    result.entity.potionEffects.add('alexscaves:irradiated', 200, 4, false, true)
                }
                entity.remove('discarded')
            })
            .tag("alexscaves:ferromagnetic_entities")
})

EntityJSEvents.modifyEntity(event => {
    event.modify('kubejs:alpha_particle', builder => {
        builder.onAddedToWorld(entity => {
            entity.setNoGravity(true)
        })
    })
})
/**
 * 
 * @param {Internal.Entity} entity 
 * @param {Internal.BlockHitResult} result 
 */

global.onHitBehavior = (entity, result) =>{
    let block = entity.level.getBlock(result.blockPos)
    let speed = entity.getDeltaMovement().length()
    let output = global.findCyclotronResult(entity.level, block, speed)
    if (output) {
        block.set('minecraft:air')
        block.popItem(output)
    }
    entity.level.createExplosion(entity.x, entity.y, entity.z).strength(1).explode()
    entity.remove('discarded')
}
