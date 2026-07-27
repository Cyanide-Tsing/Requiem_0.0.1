/**
 * 
 * @param {BlockEntity} be 
 * @returns 
 */

/*
global.doFEexchange = (be) => {
    let energy = be.getCapability(ForgeCapabilities.ENERGY).orElse(null).getEnergyStored()
    if(energy <= 0)return;
    if(be.getBlock().down.id !== "powergrid:battery")return;
    let battery = be.getBlock().down
    let extracted = Math.min(energy, 7200 - battery.entityData.getInt("Energy"))
    console.log(extracted)
    if(extracted <= 0) return;
    let final = battery.entityData.getInt("Energy")+extracted
    if(isNaN(final))return;
    battery.setEntityData({Energy:final})
    be.getCapability(ForgeCapabilities.ENERGY).orElse(null).extractEnergy(extracted, false)
}
    */