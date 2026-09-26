const $Neollager = Java.loadClass('com.Polarice3.Goety.common.entities.ally.illager.Neollager')

let animLog = 0
let rotLog = 0
let rotPrev = {}

// KubeJS 的 Math.atan2 返回 NaN，用 8 方向查表代替。
// 返回 Minecraft 偏航角：0=南(+Z)，90=西(-X)，180/-180=北(-Z)，-90=东(+X)。
function yawFromDelta(dx, dz) {
    let adx = dx < 0 ? -dx : dx
    let adz = dz < 0 ? -dz : dz
    if (adx < 0.0001 && adz < 0.0001) return null
    if (adx > adz * 2.4142) return dx > 0 ? -90 : 90
    if (adz > adx * 2.4142) return dz > 0 ? 0 : 180
    if (dx > 0 && dz > 0) return -45
    if (dx > 0) return -135
    if (dz > 0) return 45
    return 135
}

StartupEvents.registry('entity_type', event => {
    event.createCustom('apprentice', $Neollager, modifyBuilder => {
        modifyBuilder.mobInteract(ctx => global.apprenticeInteract(ctx))
        // 服务端：在实体 tick 末尾把头/身体朝向对齐到移动方向。
        // KubeJS 里 setYRot 要用 setYaw，但 setYHeadRot / setYBodyRot 名字不变。
        modifyBuilder.tick(entity => {
            if (entity.level.isClientSide()) return
            try {
                let id = entity.id
                let x = entity.x, z = entity.z
                let prev = rotPrev[id]
                if (prev) {
                    let dx = x - prev[0], dz = z - prev[1]
                    if (dx * dx + dz * dz > 0.0001) {
                        let yaw = yawFromDelta(dx, dz)
                        if (yaw !== null) {
                            entity.setYHeadRot(yaw)
                            entity.setYBodyRot(yaw)
                            rotLog++
                            if (rotLog % 40 === 0) console.log('[apprentice rot] yaw=' + yaw)
                        }
                    }
                }
                rotPrev[id] = [x, z]
            } catch (e) {
                rotLog++
                if (rotLog % 40 === 0) console.log('[apprentice rot] ERR ' + e)
            }
        })
    })
        .sized(0.6, 1.9)
        .mobCategory('creature')
        .clientTrackingRange(16)
        .updateInterval(3)
        .modelResource(entity => 'kubejs:geo/entity/villager.geo.json')
        .textureResource(entity => 'kubejs:textures/entity/apprentice.png')
        .animationResource(entity => 'kubejs:animations/entity/apprentice.animation.json')
        .addAnimationController('controller', 1, event => {
            let moving = false
            try {
                let e = event.getEntity()
                // 若渲染用的是 WrappedAnimatableEntity 包装，取其原始实体
                let real = e
                if (e.getOriginalEntity) {
                    try { real = e.getOriginalEntity() } catch (e2) {}
                }
                // 用 goety 仆从自带的 isMoving()：内部是 WalkAnimationState.speed() >= 0.01，
                // 基于实际位移而非速度，能区分「走路」和「有 Goal 但原地漂移」。
                moving = real.isMoving()
                animLog++
                if (animLog % 100 === 0) console.log('[apprentice anim] moving=' + moving + ' x=' + real.x + ' z=' + real.z)
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
        .scaleModelForRender(ctx => {
            // 关键修复：EntityJS 0.6.6 的 CustomKubeJSEntityRenderer 把实体包成 WrappedAnimatableEntity，
            // 它不转发 yBodyRot/yHeadRot，导致 GeoEntityRenderer 读到 0，模型永远按 180-0=180 渲染（平移）。
            // 这里在 applyRotations 之前，用未包装的原始实体把正确的偏航角补回来。
            try {
                let yaw = ctx.entity.getViewYRot(ctx.partialTick)
                ctx.poseStack.mulPose(RotationAxis.YP.deg(-yaw))
            } catch (e) {}
        })
})
