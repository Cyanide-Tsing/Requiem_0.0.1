ServerEvents.recipes(event=>{
    event.remove({type:"createoreexcavation:drilling"})
    event.remove({type:"createoreexcavation:extracting"})
    event.remove({type:"createoreexcavation:vein"})

    event.recipes.createoreexcavation.vein('{"translate":"vein.requiem.lithophilic_cluster"}', "kubejs:lithophilic_cluster")
        .alwaysInfinite()
        .priority(1)
        .biomeWhitelist(
            "minecraft:is_overworld"
        )
        .placement(32, 8, 108437742)
        .id("requiem:lithophilic_cluster")
    
    event.recipes.createoreexcavation.drilling([Item.of("kubejs:lithophilic_cluster").withChance(0.80), Item.of("kubejs:lithophilic_cluster").withChance(0.30), Item.of("minecraft:flint").withChance(0.9)], "requiem:lithophilic_cluster", 100)
        .fluid(Fluid.of("kubejs:sodium_hydroxide", 10))
        .drill("createoreexcavation:diamond_drill")
        .stress(256)
        .id("requiem:drilling/lithophilic_cluster")

    event.recipes.createoreexcavation.vein('{"translate":"vein.requiem.chalcophilic_cluster"}', "kubejs:chalcophilic_cluster")
        .alwaysInfinite()
        .priority(1)
        .biomeWhitelist(
            "minecraft:is_overworld"
        )
        .placement(32, 8, 348977495)
        .id("requiem:chalcophilic_cluster")
    
    event.recipes.createoreexcavation.drilling([Item.of("kubejs:chalcophilic_cluster").withChance(0.80), Item.of("kubejs:chalcophilic_cluster").withChance(0.30), Item.of("spelunkery:rough_cinnabar").withChance(0.9)], "requiem:chalcophilic_cluster", 100)
        .fluid("createdieselgenerators:ethanol 10")
        .drill("createoreexcavation:diamond_drill")
        .stress(256)
        .id("requiem:drilling/chalcophilic_cluster")

    event.recipes.createoreexcavation.vein('{"translate":"vein.requiem.rare_earth_cluster"}', "kubejs:rare_earth_cluster")
        .alwaysInfinite()
        .priority(0)
        .biomeWhitelist("requiem:has_rare_earth_deposit")
        .placement(32, 8, 882499314)
        .id("requiem:rare_earth_cluster")
    
    event.recipes.createoreexcavation.drilling([Item.of("kubejs:rare_earth_cluster").withChance(0.80), Item.of("kubejs:rare_earth_cluster").withChance(0.30), Item.of("kubejs:fluorite").withChance(0.9)], "requiem:rare_earth_cluster", 100)
        .fluid("kubejs:ethylene_carbonate 10")
        .drill("createoreexcavation:diamond_drill")
        .stress(256)
        .id("requiem:drilling/rare_earth_cluster")
})

ServerEvents.tags('worldgen/biome', event =>{
    event.add("requiem:has_rare_earth_deposit", ["alexscaves:magnetic_caves", "ad_astra:martian_wastelands", "ad_astra:martian_polar_caps", "ad_astra:martian_canyon_creek"])
})