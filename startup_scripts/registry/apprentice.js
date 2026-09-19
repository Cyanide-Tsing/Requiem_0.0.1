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
            if (event.isMoving()) {
                event.thenLoop('walk')
            } else {
                event.thenLoop('idle')
            }
            return true
        })
})
