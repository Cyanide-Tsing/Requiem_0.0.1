const $Neollager = Java.loadClass('com.Polarice3.Goety.common.entities.ally.illager.Neollager')

StartupEvents.registry('entity_type', event => {
    event.createCustom('apprentice', $Neollager, modifyBuilder => {
        modifyBuilder.mobInteract(ctx => global.apprenticeInteract(ctx))
    })
        .sized(0.6, 1.9)
        .mobCategory('creature')
        .clientTrackingRange(16)
        .updateInterval(3)
        .modelResource(entity => 'kubejs:geo/entity/villager.geo.json')
        .textureResource(entity => 'kubejs:textures/entity/apprentice.png')
        .animationResource(entity => 'kubejs:animations/entity/apprentice.animation.json')
        .addAnimationController('controller', 1, event => {
            // 用位移判断是否移动（goety 仆从的 limbSwing 可能不更新）
            let moving = false
            try {
                let e = event.getEntity()
                let mx = e.getMotionX()
                let mz = e.getMotionZ()
                moving = mx * mx + mz * mz > 0.0001
            } catch (err) {
                moving = event.isMoving()
            }
            if (moving) {
                event.thenLoop('walk')
            } else {
                event.thenLoop('idle')
            }
            return true
        })
        .addTriggerableAnimationController('interact', 1, 'interact', 'interact', 'PLAY_ONCE')
})
