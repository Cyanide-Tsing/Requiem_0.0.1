CapabilityEvents.blockEntity(event => {
	event.attach("powergrid:battery",
		CapabilityBuilder.ENERGY.customBlockEntity()
		.canExtract(() => true)
		.canReceive(() => true)
		.getMaxEnergyStored(() => 72000)
		.extractEnergy((entity, amount, simulate) => {
			let beBlock = entity.level.getBlock(entity.blockPos.x, entity.blockPos.y, entity.blockPos.z)
			let energy = 10*beBlock.entityData.getInt("Energy")
			let extracted = Math.min(energy, amount)
			if (!simulate) {
				beBlock.mergeEntityData({Energy:(energy - extracted)/10})
			}
			return extracted
		})
      	.receiveEnergy((entity, amount, simulate) => {
			let beBlock = entity.level.getBlock(entity.blockPos.x, entity.blockPos.y, entity.blockPos.z)
			let energy = 10*beBlock.entityData.getInt("Energy")
			let received = Math.min(72000 - energy, amount)
			if (!simulate) {
				beBlock.mergeEntityData({Energy:(energy + received)/10})
			}
			return received
		})
		.getEnergyStored(entity => {
			let beBlock = entity.level.getBlock(entity.blockPos.x, entity.blockPos.y, entity.blockPos.z)
			return 10*beBlock.entityData.getInt("Energy")
		})
	)
})