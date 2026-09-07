const FluidStack = Java.loadClass("net.minecraftforge.fluids.FluidStack");
const FluidStackJS = Java.loadClass('dev.latvian.mods.kubejs.fluid.FluidStackJS');

StartupEvents.registry('block', event =>{
  event.create('demon_core').soundType('glass').hardness(6).resistance(1).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool')
  .blockEntity(blockEntity => {
    blockEntity.clientTick(entity =>global.runningGasParticles(entity));
    blockEntity.serverTick(entity => global.doEnergy(entity.level, entity.x, entity.y, entity.z));
    blockEntity.initialData({thermalEnergy:0})
  })
  //.randomTick(event => global.doEnergy(event.level, event.block.x, event.block.y, event.block.z));

  event.create('thermal_exchanger').soundType('stone').hardness(6).resistance(1).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool')
  .blockEntity(blockEntity => {
    blockEntity.clientTick(entity =>global.runningParticles(entity));
    blockEntity.serverTick(entity => global.doThermalExchange(entity));
    blockEntity.initialData({thermalEnergy:0})
  })

  event.create('potent_sulfur').soundType('stone').hardness(3).resistance(1).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool')
  .blockEntity(blockEntity => {
    blockEntity.serverTick(entity => global.summonSulfurGas(entity));
  })

  event.create('turbine').soundType('stone').hardness(6).resistance(1).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool').tagBlock('create:wretch_pickup')
  .blockEntity(blockEntity => {
    blockEntity.clientTick(entity => {});
    blockEntity.serverTick(entity => {});
    blockEntity.initialData({energy:0})
    blockEntity.attachCapability(
      CapabilityBuilder.ENERGY.customBlockEntity()
			.canExtract(() => true)
			.canReceive(() => true)
			.extractEnergy((entity, amount, simulate) => {
				let energy = entity.persistentData.getInt("energy")
				let extracted = Math.min(energy, amount)
				if (!simulate) {
					entity.persistentData.putInt("energy", energy - extracted)
				}
				return extracted
			})
      .receiveEnergy((be, amount, simulate) => {
				let energy = be.persistentData.getInt("energy")
				let received = Math.min(32767 - energy, amount)
				if (!simulate) {
					be.persistentData.putInt("energy", energy + received)
				}
				return received

			})
			.getEnergyStored(entity => {
				return entity.persistentData.getInt("energy")
			})
			.getMaxEnergyStored(() => 32767))
  })

  event.create('magnesium_cell').soundType('stone').hardness(6).resistance(1).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool').tagBlock('create:wretch_pickup')
  .blockEntity(blockEntity => {
    blockEntity.clientTick(entity => {});
    blockEntity.serverTick(entity => {});
    blockEntity.initialData({energy:0})
    blockEntity.attachCapability(
      CapabilityBuilder.ENERGY.customBlockEntity()
			.canExtract(() => true)
			.canReceive(() => true)
			.extractEnergy((entity, amount, simulate) => {
				let energy = entity.persistentData.getInt("energy")
				let extracted = Math.min(energy, amount)
				if (!simulate) {
					entity.persistentData.putInt("energy", energy - extracted)
				}
				return extracted
			})
      .receiveEnergy((be, amount, simulate) => {
				let energy = be.persistentData.getInt("energy")
				let received = Math.min(20000000 - energy, amount)
				if (!simulate) {
					be.persistentData.putInt("energy", energy + received)
				}
				return received

			})
			.getEnergyStored(entity => {
				return entity.persistentData.getInt("energy")
			})
			.getMaxEnergyStored(() => 20000000))
  })
  
  event.create('electric_extractor').soundType('stone').hardness(6).resistance(1).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool').tagBlock('create:wretch_pickup')
  .blockEntity(blockEntity => {
    blockEntity.inventory(9,1);
    blockEntity.clientTick(entity => {});
    blockEntity.serverTick(entity => {
        global.extractElectricity(entity)
    });
    blockEntity.initialData({energy:0})
    blockEntity.attachCapability(
      CapabilityBuilder.ITEM.blockEntity()
        .extractItem((blockEntity, slot, amount, simulate) => blockEntity.inventory.extractItem(slot, amount, simulate))
        .insertItem((blockEntity, slot, stack, simulate) => blockEntity.inventory.insertItem(slot, stack, simulate))
        .getSlotLimit((blockEntity, slot) => blockEntity.inventory.getSlotLimit(slot))
        .getSlots((blockEntity) => blockEntity.inventory.slots)
        .getStackInSlot((blockEntity, slot) => blockEntity.inventory.getStackInSlot(slot))
        .isItemValid((blockEntity, slot, stack) => blockEntity.inventory.isItemValid(slot, stack))
        .availableOn((blockEntity, direction) => true)
    );
    blockEntity.attachCapability(
      CapabilityBuilder.ENERGY.customBlockEntity()
			.canExtract(() => true)
			.canReceive(() => true)
			.extractEnergy((entity, amount, simulate) => {
				let energy = entity.persistentData.getInt("energy")
				let extracted = Math.min(energy, amount)
				if (!simulate) {
					entity.persistentData.putInt("energy", energy - extracted)
				}
				return extracted
			})
      .receiveEnergy((be, amount, simulate) => {
				let energy = be.persistentData.getInt("energy")
				let received = Math.min(32767 - energy, amount)
				if (!simulate) {
					be.persistentData.putInt("energy", energy + received)
				}
				return received

			})
			.getEnergyStored(entity => {
				return entity.persistentData.getInt("energy")
			})
			.getMaxEnergyStored(() => 32767))
  })

  event.create('fluid_bin').soundType('stone').hardness(6).resistance(1).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool').tagBlock('create:wretch_pickup')
  .blockEntity(blockEntity => {
    blockEntity.clientTick(entity => {});
    blockEntity.serverTick(entity => {});
    blockEntity.attachCapability(
        CapabilityBuilder.FLUID.customBlockEntity()
        .getFluid((be) => {
          let content = be.persistentData.getCompound("content");
          if(!content || content.getInt("amount") === 0) return Fluid.of('minecraft:water', 8000);
          return Fluid.of(content.getString("id"), content.getInt("amount"));
        })
        .onFill((be, fluidStack, simulate) => {
            return fluidStack.getAmount()
        })
        .onDrain((be, fluidStack, simulate) => {
            return Math.min(8000, fluidStack.getAmount())
        })
        .isFluidGood((be, fluidStack) => true)
        .getCapacity((be) => 8000)
        .availableOn((be, dir) => true)
      )
  })
/*
  event.create('battery_fe_attachment').soundType('stone').hardness(6).resistance(1).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool').lightLevel(0.5)
  .blockEntity(be =>{
    be.serverTick(be => {
      global.doFEexchange(be)
    })
    be.attachCapability(
      CapabilityBuilder.ENERGY.customBlockEntity()
      .canExtract(() => true)
      .canReceive(() => true)
      .getMaxEnergyStored(() => 2000000)
      .extractEnergy((entity, amount, simulate) => {
				let energy = entity.persistentData.getInt("energy")
				let extracted = Math.min(energy, amount)
				if (!simulate) {
					entity.persistentData.putInt("energy", energy - extracted)
				}
				return extracted
			})
      .receiveEnergy((be, amount, simulate) => {
				let energy = be.persistentData.getInt("energy")
				let received = Math.min(2000000 - energy, amount)
				if (!simulate) {
					be.persistentData.putInt("energy", energy + received)
				}
				return received

			})
      .getEnergyStored(entity => {
				return entity.persistentData.getInt("energy")
			})
    )
  })
*/
  event.create('alphabet').soundType('stone').hardness(6).resistance(1).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool').lightLevel(0.5).fullBlock(false).viewBlocking(false).renderType("translucent").defaultCutout()
  .blockEntity(blockEntity => {
    blockEntity.inventory(9,1);
    blockEntity.rightClickOpensInventory();
    blockEntity.clientTick(entity =>global.runningSprinklingParticles(entity));
    blockEntity.serverTick(entity => global.doDecipher(entity));
    blockEntity.initialData({Memory:0})
    blockEntity.attachCapability(
      CapabilityBuilder.ITEM.blockEntity()
        .extractItem((blockEntity, slot, amount, simulate) => blockEntity.inventory.extractItem(slot, amount, simulate))
        .insertItem((blockEntity, slot, stack, simulate) => blockEntity.inventory.insertItem(slot, stack, simulate))
        .getSlotLimit((blockEntity, slot) => blockEntity.inventory.getSlotLimit(slot))
        .getSlots((blockEntity) => blockEntity.inventory.slots)
        .getStackInSlot((blockEntity, slot) => blockEntity.inventory.getStackInSlot(slot))
        .isItemValid((blockEntity, slot, stack) => blockEntity.inventory.isItemValid(slot, stack))
        .availableOn((blockEntity, direction) => true)
    );
  })

  event.create('scribble_table').soundType('wood').hardness(6).resistance(1).requiresTool(true).tagBlock('minecraft:mineable/axe').lightLevel(0.5).fullBlock(false).viewBlocking(false).noValidSpawns(true).suffocating(false).renderType("translucent").defaultCutout()
  .blockEntity(blockEntity => {
    blockEntity.inventory(9,2);
    blockEntity.rightClickOpensInventory();
    blockEntity.clientTick(entity =>global.runningSprinklingParticles(entity));
    blockEntity.serverTick(entity => global.doScribble(entity));
    blockEntity.initialData({Memory:0})
    blockEntity.attachCapability(
      CapabilityBuilder.ITEM.blockEntity()
        .extractItem((blockEntity, slot, amount, simulate) => blockEntity.inventory.extractItem(slot, amount, simulate))
        .insertItem((blockEntity, slot, stack, simulate) => blockEntity.inventory.insertItem(slot, stack, simulate))
        .getSlotLimit((blockEntity, slot) => blockEntity.inventory.getSlotLimit(slot))
        .getSlots((blockEntity) => blockEntity.inventory.slots)
        .getStackInSlot((blockEntity, slot) => blockEntity.inventory.getStackInSlot(slot))
        .isItemValid((blockEntity, slot, stack) => blockEntity.inventory.isItemValid(slot, stack))
        .availableOn((blockEntity, direction) => true)
    );
  })

  event.create('soul_blast_furnace').soundType('stone').hardness(6).resistance(1).requiresTool(true).tagBlock('minecraft:mineable/axe').lightLevel(0.5)
  .blockEntity(blockEntity => {
    blockEntity.inventory(2,1);
    blockEntity.clientTick(entity => global.runningSoulParticles(entity));
    blockEntity.serverTick(entity => global.doSoulBlasting(entity));
    blockEntity.attachCapability(
      CapabilityBuilder.ITEM.blockEntity()
        .extractItem((blockEntity, slot, amount, simulate) => blockEntity.inventory.extractItem(1, amount, simulate))
        .insertItem((blockEntity, slot, stack, simulate) => blockEntity.inventory.insertItem(0, stack, simulate))
        .getSlotLimit((blockEntity, slot) => blockEntity.inventory.getSlotLimit(slot))
        .getSlots((blockEntity) => blockEntity.inventory.slots)
        .getStackInSlot((blockEntity, slot) => blockEntity.inventory.getStackInSlot(slot))
        .isItemValid((blockEntity, slot, stack) => blockEntity.inventory.isItemValid(slot, stack))
        .availableOn((blockEntity, direction) => true)
    );
  })
})

global.extractElectricity = (entity) => {
    if(entity.inventory.countNonEmpty() > 7)return;
    let pos = findInvBackUp(entity)
    let batteryCaps = entity.inventory.getItem(pos).getCapability(ForgeCapabilities.ENERGY).resolve().orElse(null)
    let extractorCaps = entity.getCapability(ForgeCapabilities.ENERGY).resolve().orElse(null)
    let MRA, AMOUNT;
    if(batteryCaps.getEnergyStored() > 0) {
        MRA = extractorCaps.getMaxEnergyStored() - extractorCaps.getEnergyStored()
        AMOUNT = batteryCaps.extractEnergy(MRA, false)
        extractorCaps.receiveEnergy(AMOUNT, false)
    }
}

function findInvBackUp(entity){
    let size = entity.inventory.getSlots();
    let index, item;
    for(index=size-1; index>=0; index--){
        item = entity.inventory.getItem(index)
        if(item.id === 'kubejs:leyden_jar' && item?.nbt.energy) return index;
        //console.log('1')
    }
    return -1;
}

function findAir(entity){
    let size = entity.inventory.getSlots();
    let index, item;
    for(index=size-1; index>=0; index--){
        item = entity.inventory.getItem(index)
        if(item.id === 'minecraft:air') return index;
    }
    return -1;
}

//const BasinBlock = Java.loadClass('com.simibubi.create.content.processing.basin.BasinBlock');
//const Properties = Java.loadClass('net.minecraft.world.level.block.state.BlockBehaviour$Properties');
//const BasinBlockEntity = Java.loadClass('com.simibubi.create.content.processing.basin.BasinBlockEntity')
//const ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries');
/*
let basinBlockBuilder = null;

StartupEvents.registry('block', event=>{
    console.log('正在注册自定义 Basin...');
    basinBlockBuilder = event.createCustom('custom_basin', () => {
        let props = Properties.of().strength(2.0).noOcclusion();
        try {
            let block = new BasinBlock(props);
            return block;
        } catch(e) {
            console.error('创建 BasinBlock 失败:', e);
            // 返回一个 fallback 方块防止崩溃（可选）
            return event.create('fallback', 'basic').material('stone').get();
        }
    })
})

StartupEvents.registry('block_entity_type', event => {
    let block = basinBlockBuilder.get();
    if (!block) {
        console.error('Failed to get custom basin block');
        return;
    }
    event.create('custom_basin_be', BasinBlockEntity, block);
});*/

/*
  event.create('electrolyzer').soundType('stone').hardness(6).resistance(1).requiresTool(true).tagBlock('minecraft:mineable/pickaxe').tagBlock('minecraft:needs_iron_tool').tagBlock('create:wretch_pickup')
  .blockEntity(blockEntity => {
    blockEntity.inventory(9,1);
    blockEntity.attachCapability(
      CapabilityBuilder.ITEM.blockEntity()
        .extractItem((blockEntity, slot, amount, simulate) => blockEntity.inventory.extractItem(slot, amount, simulate))
        .insertItem((blockEntity, slot, stack, simulate) => blockEntity.inventory.insertItem(slot, stack, simulate))
        .getSlotLimit((blockEntity, slot) => blockEntity.inventory.getSlotLimit(slot))
        .getSlots((blockEntity) => blockEntity.inventory.slots)
        .getStackInSlot((blockEntity, slot) => blockEntity.inventory.getStackInSlot(slot))
        .isItemValid((blockEntity, slot, stack) => blockEntity.inventory.isItemValid(slot, stack))
        .availableOn((blockEntity, direction) => true)
    );
    blockEntity.clientTick(entity => {});
    blockEntity.serverTick(entity => {});
    blockEntity.initialData({energy:0})
    blockEntity.attachCapability(
      CapabilityBuilder.ENERGY.customBlockEntity()
			.canExtract(() => true)
			.canReceive(() => true)
			.extractEnergy((entity, amount, simulate) => {
				let energy = entity.persistentData.getInt("energy")
				let extracted = Math.min(energy, amount)
				if (!simulate) {
					entity.persistentData.putInt("energy", energy - extracted)
				}
				return extracted
			})
      .receiveEnergy((be, amount, simulate) => {
				let energy = be.persistentData.getInt("energy")
				let received = Math.min(20000000 - energy, amount)
				if (!simulate) {
					be.persistentData.putInt("energy", energy + received)
				}
				return received

			})
			.getEnergyStored(entity => {
				return entity.persistentData.getInt("energy")
			})
			.getMaxEnergyStored(() => 20000000))
    blockEntity.attachCapability(
        CapabilityBuilder.FLUID.customBlockEntity()
        .getFluid((be) => {
          let content = be.persistentData.getCompound("content");
          if(!content || content.getInt("amount") === 0) return '0x minecraft:empty';
          return Fluid.of(content.getString("id"), content.getInt("amount"));
        })
        .onFill((be, fluidStack, simulate) => {
            let data = be.persistentData.getCompound("content")
            if(!data){
                be.persistentData.put("content", {"id":"minecraft:empty", "amount":0})
                return 0;
            }
            if(data.getString("id") !== "minecraft:empty" && data.getString("id") !== fluidStack.getId()) return 0;
            else{
                let filled = Math.min(8000 - data.getInt("amount"), fluidStack.getAmount())
                if(!simulate){
                  data.putString("id", fluidStack.getId());
                  data.putInt("amount", data.getInt("amount") + filled);
                }
                return filled;
            }
        })
        .onDrain((be, fluidStack, simulate) => {
            let data = be.persistentData.getCompound("content")
            if(!data){
                be.persistentData.put("content", {"id":"minecraft:empty", "amount":0})
                return 0;
            }
            if(data.getString("id") === "minecraft:empty" || data.getString("id") !== fluidStack.getId() || data.getInt("amount") === 0) return 0;
            else{
                let drained = Math.min(data.getInt("amount"), fluidStack.getAmount())
                if(!simulate){
                    if(drained < data.getInt("amount")) {
                        data.putString("id", fluidStack.getId());
                        data.putInt("amount", data.getInt("amount") - drained);
                    }
                    else{
                        data.putString("id", "minecraft:empty");
                        data.putInt("amount", 0)
                    }
                }
                return drained;
            }
        })
        .isFluidGood((be, fluidStack) => true)
        .getCapacity((be) => 8000)
        .availableOn((be, dir) => true)
      )
  })
  */