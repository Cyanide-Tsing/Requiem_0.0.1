const $Neollager = Java.loadClass('com.Polarice3.Goety.common.entities.ally.illager.Neollager')

let animPrev = {}
let animLog = 0

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
            // 用坐标位移判断是否移动（不依赖速度/limbSwing）
            let moving = false
            try {
                let e = event.getEntity()
                // 若渲染用的是 WrappedAnimatableEntity 包装，取其原始实体
                let real = e
                if (e.getOriginalEntity) {
                    try { real = e.getOriginalEntity() } catch (e2) {}
                }
                let id = real.id
                let x = real.x, z = real.z
                let prev = animPrev[id]
                if (prev) {
                    let dx = x - prev[0], dz = z - prev[1]
                    // 阈值提高，忽略原地工作时的微小抖动
                    moving = dx * dx + dz * dz > 0.01
                }
                animPrev[id] = [x, z]
                animLog++
                if (animLog % 100 === 0) console.log('[apprentice anim] id=' + id + ' moving=' + moving + ' x=' + x + ' z=' + z + ' dx=' + (prev ? x - prev[0] : 0) + ' dz=' + (prev ? z - prev[1] : 0))
            } catch (err) {
                moving = event.isMoving()
                animLog++
                if (animLog % 100 === 0) console.log('[apprentice anim] ERR ' + err)
            }
            if (moving) {
                event.thenLoop('walk')
            } else {
                event.thenLoop('idle')
            }
            return true
        })
        .addTriggerableAnimationController('interact', 1, 'interact', 'interact', 'PLAY_ONCE')
        .applyRotations(ctx => {
            // yBodyRot（身体旋转）客户端不同步，静止时不更新；
            // 而 yHeadRot（头）已通过 ClientboundRotateHeadPacket 同步。
            // 这里让身体朝向跟随头部，修复“视线转了但模型不转”的问题。
            try {
                let entity = ctx.entity
                let poseStack = ctx.poseStack
                let headYaw = entity.getYHeadRot()
                let bodyYaw = ctx.rotationYaw
                // 默认身体旋转是 (180 - bodyYaw)，我们要的是 (180 - headYaw)，
                // 所以额外旋转 (bodyYaw - headYaw)。
                poseStack.mulPose(Axis.YP.rotationDegrees(bodyYaw - headYaw))
            } catch (e) {}
        })
})
