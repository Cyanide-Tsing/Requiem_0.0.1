const $Neollager = Java.loadClass('com.Polarice3.Goety.common.entities.ally.illager.Neollager')
const $VindicatorServant = Java.loadClass('com.Polarice3.Goety.common.entities.ally.illager.VindicatorServant')

let rotLog = 0
let rotPrev = {}
let bodyYaw = {}

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

// 把角度差折叠到 [-180, 180]
function wrapDegrees(d) {
    d = d % 360
    if (d > 180) d -= 360
    if (d < -180) d += 360
    return d
}

// 服务端：在实体 tick 末尾设置朝向。
// 原版渲染器按 yBodyRot 转身体、按 (yHeadRot - yBodyRot) 转头，
// 所以这里头立即转向目标、身体逐渐跟上，实现“先转头、身体跟上”。
function applyServantRotation(entity) {
    if (entity.level.isClientSide()) return
    try {
        let id = entity.id
        let x = entity.x, z = entity.z
        let prev = rotPrev[id]
        if (prev) {
            let dx = x - prev[0], dz = z - prev[1]
            if (dx * dx + dz * dz > 0.0001) {
                let target = yawFromDelta(dx, dz)
                if (target !== null) {
                    entity.setYHeadRot(target)
                    let current = bodyYaw[id]
                    if (current === undefined) current = target
                    let diff = wrapDegrees(target - current)
                    let maxRot = 15
                    if (diff > maxRot) diff = maxRot
                    else if (diff < -maxRot) diff = -maxRot
                    bodyYaw[id] = current + diff
                    entity.setYBodyRot(bodyYaw[id])
                }
            }
        }
        rotPrev[id] = [x, z]
    } catch (e) {
        rotLog++
        if (rotLog % 40 === 0) console.log('[servant rot] ERR ' + e)
    }
}

StartupEvents.registry('entity_type', event => {
    let builder = event.createCustom('apprentice', $Neollager, modifyBuilder => {
        modifyBuilder.mobInteract(ctx => global.apprenticeInteract(ctx))
        modifyBuilder.tick(entity => applyServantRotation(entity))
    })

    builder.sized(0.6, 1.95)
        .mobCategory('creature')
        .clientTrackingRange(16)
        .updateInterval(3)
        // 换成新刌民（Neollager）的原版渲染器：能正确转头/抬头，代价是失去自定义 GeckoLib 贴图/动画。
        .setRendererClass('com.Polarice3.Goety.client.render.NeollagerRenderer')

    let gardener = event.createCustom('gardener', $VindicatorServant, modifyBuilder => {
        modifyBuilder.mobInteract(ctx => global.gardenerInteract(ctx))
        modifyBuilder.tick(entity => applyServantRotation(entity))
    })

    gardener.sized(0.6, 1.95)
        .mobCategory('creature')
        .clientTrackingRange(16)
        .updateInterval(3)
        .setRendererClass('com.Polarice3.Goety.client.render.VindicatorServantRenderer')
})
