const AbyssalChasm = ["abyssal", "chasm", "trench", "underwater", "ocean", "sea", "pelagic", "benthic", "muck", "geothermal", "vent", "tuff", "ink", "sponge", "anemone", "valve", "smoker", "darkness", "tube", "worm", "magma", "bubble", "staff", "altar", "sight", "abyssmarine", "prismarine", "wave", "submarine", "copper", "pressure", "drain", "pearl", "mussel", "zone", "trade", "diving", "lanternfish", "pig", "tripodfish", "gossamer", "mine", "guardian", "hullbreaker", "deep", "one", "knight", "mage", "enigmatic", "bioluminescent", "gazing", "floating", "waves", "depth"]
const MagneticCaves = ["magnetic", "caves", "azure", "scarlet", "underground", "galena", "iron", "neodymium", "node", "activator", "metal", "scrap", "mining", "chain", "ferrofluid", "swarf", "tesla", "bulb", "lightning", "force", "pillar", "spire", "ore", "packed", "stuck", "boots", "cling", "upside", "reverse", "scan", "hologram", "energized", "field", "stabilize", "quarry", "gauntlet", "notor", "boundroid", "ferrouslime", "magnetron", "teletor", "resistor", "vanadium", "lead"]
const PrimordialCaves = ["primordial", "caves", "dinosaur", "prehistoric", "past", "extinct", "primitive", "ancient", "archaic", "fossil", "reptile", "vine", "moss", "bone", "limestone", "underneath", "fern", "ambersol", "pillar", "flytrap", "cycad", "pewen", "painting", "footprint", "tame", "stomp", "flying", "ancestor", "caveman", "troglodyte", "spear", "club", "chop", "sandstone", "subterranodon", "vallumraptor", "grottoceratops", "trilocaris", "relicheirus", "tremorsaurus", "seething", "monolith", "archeology", "egg"]
const ForlornHollows = ["forlorn", "hollows", "buried", "guano", "bat", "stone", "idol", "cult", "worship", "hole", "sealed", "basin", "canyon", "demon", "gloomoth", "watcher", "underzealot", "corrodent", "vesper", "forsaken", "dust", "sacrifice", "darkness", "evil", "mammal", "thornwood", "coprolith", "shadows", "fear", "summoning", "vessel", "screech", "follows", "stalked", "burrow", "temple", "candle", "redstone", "eyes", "dread", "cursed", "beholder", "possessed", "desolate", "abandon", "tatter"]
const ToxicCaves = ["toxic", "caves", "nuclear", "bomb", "emit", "explosion", "radiation", "death", "glowing", "rays", "green", "radrock", "acid", "melt", "uranium", "rust", "sulfur", "cinder", "radon", "danger", "peril", "underweed", "waste", "rod", "gloomy", "hazmat", "polyethylene", "siren", "apocalypse", "geothermal", "vent", "tuff", "mud", "corrosive", "nucleeper", "brainiac", "gammaroach", "raycat", "radgill", "detonate", "leak", "remnant", "furnace", "shard", "fissile", "carminite"]
const CandyCavity = ["candy", "cavity", "frosting", "chocolate", "sweet", "splendid", "delight", "puff", "cane", "sundrop", "sugar", "soda", "sprinkles", "cream", "peppermint", "licoroot", "cookie", "wafer", "cone", "gumbeeper", "gumball", "caniac", "candicorn", "bottle", "gingerbread", "worm", "gummy", "bear", "sweetberry", "vanilla", "catgacating", "caramel", "rainbow", "licowitch"]
//const Enchantment = ["air", "animal", "baguette", "ball", "beast", "berata", "bless", "cold", "creature", "cthulhu", "cube", "curse", "darkness", "demon", "destroy", "dry", "earth", "elder", "elemental", "embiggen", "enchant", "fhtagn", "fiddle", "fire", "free", "fresh", "galvanize", "grow", "hot", "humanoid", "ignite", "imbue", "inside", "klaatu", "light", "limited", "mental", "mglwnafh", "niktu", "of", "other", "phnglui", "physical", "range", "rlyeh", "scrolls", "self", "shorten", "shrink", "snuff", "sphere", "spirit", "stale", "stretch", "the", "towards", "twist", "undead", "water", "wet", "wgahnagl", "xyzzy"]

const enchantmentWords = {
    "sharpness": ["destroy", "physical", "humanoid"],
    "smite": ["destroy", "undead", "demon"],
    "bane_of_arthropods": ["destroy", "animal", "creature"],
    "fire_aspect": ["fire", "ignite", "hot"],
    "looting": ["bless", "scrolls", "baguette"],
    "sweeping": ["sphere", "twist", "embiggen"],
    "knockback": ["stretch", "towards", "shrink"],
    "power": ["destroy", "range", "the"],
    "punch": ["stretch", "towards", "range"],
    "flame": ["fire", "ignite", "range"],
    "infinity": ["free", "enchant", "cube"],
    "multishot": ["sphere", "range", "ball"],
    "piercing": ["inside", "physical", "other"],
    "quick_charge": ["galvanize", "shorten", "fresh"],
    "protection": ["bless", "sphere", "self"],
    "fire_protection": ["bless", "fire", "hot"],
    "blast_protection": ["bless", "destroy", "sphere"],
    "projectile_protection": ["bless", "range", "physical"],
    "feather_falling": ["bless", "earth", "stretch"],
    "thorns": ["twist", "physical", "self"],
    "respiration": ["water", "wet", "fresh"],
    "aqua_affinity": ["water", "wet", "galvanize"],
    "depth_strider": ["water", "stretch", "free"],
    "frost_walker": ["cold", "stretch", "rlyeh"],
    "soul_speed": ["spirit", "stretch", "rlyeh"],
    "swift_sneak": ["darkness", "stretch", "rlyeh"],
    "efficiency": ["galvanize", "shorten", "grow"],
    "silk_touch": ["self", "inside", "fiddle"],
    "unbreaking": ["stretch", "stale", "self"],
    "fortune": ["bless", "scrolls", "grow"],
    "mending": ["scrolls", "enchant", "rlyeh"],
    "vanishing_curse": ["curse", "snuff", "rlyeh"],
    "binding_curse": ["curse", "limited", "rlyeh"],
    "loyalty": ["towards", "self", "spirit"],
    "impaling": ["water", "destroy", "creature"],
    "riptide": ["water", "stretch", "galvanize"],
    "channeling": ["galvanize", "elemental", "light"],
    "luck_of_the_sea": ["bless", "water", "fresh"],
    "lure": ["galvanize", "shorten", "baguette"]
};
const alexCavesEnchantments = {
    "field_extension": ["field", "force", "energized"],
    "crystallization": ["galena", "iron", "neodymium"],
    "ferrous_haste": ["iron", "quarry", "galvanize"],
    "sightless": ["eyes", "darkness", "fear"],
    "rapid_possession": ["possessed", "cursed", "demon"],
    "detonating_death": ["sacrifice", "death", "cursed"],
    "astral_transferring": ["shadows", "vessel", "fear"],
    "far_flung": ["cane", "sugar", "sweet"],
    "sharp_cane": ["candy", "cane", "sugar"],
    "straight_hook": ["candy", "sugar", "sprinkles"],
    "plummeting_flight": ["flying", "ancient", "primitive"],
    "herd_phalanx": ["dinosaur", "tame", "stomp"],
    "chomping_spirit": ["bone", "fossil", "reptile"],
    "arrow_inducting": ["field", "magnetic", "tesla"],
    "heavy_slam": ["force", "metal", "stuck"],
    "swiftwood": ["flying", "primitive", "ancient"],
    "bonking": ["club", "bone", "spear"],
    "dazing_sweep": ["stomp", "club", "bone"],
    "energy_efficiency": ["nuclear", "uranium", "radiation"],
    "solar": ["glowing", "rays", "radiation"],
    "x_ray": ["glowing", "uranium", "cinder"],
    "gamma_ray": ["explosion", "radiation", "cinder"],
    "second_wave": ["wave", "sea", "ocean"],
    "flingling": ["underwater", "drain", "bubble"],
    "sea_swing": ["sea", "wave", "bubble"],
    "tsunami": ["wave", "depth", "pressure"],
    "charting_call": ["trade", "diving", "zone"],
    "lasting_morale": ["deep", "one", "knight"],
    "taxing_bellow": ["depth", "pressure", "underwater"],//为什么不工作？？？？？
    "enveloping_bubble": ["bubble", "water", "sea"],
    "bouncing_bolt": ["wave", "water", "bubble"],
    "seapairing": ["sea", "wave", "ocean"],
    "triple_splash": ["wave", "water", "sea"],
    "soak_seeking": ["underwater", "drain", "water"],
    "double_stab": ["cursed", "darkness", "fear"],
    "sated_blade": ["sacrifice", "demon", "fear"],
    "impending_stab": ["death", "sacrifice", "fear"],
    "precise_volley": ["shadows", "fear", "cursed"],
    "dark_nock": ["darkness", "shadows", "fear"],
    "relentless_darkness": ["darkness", "fear", "cursed"],
    "twilight_perfection": ["darkness", "shadows", "fear"],
    "shaded_respite": ["shadows", "fear", "cursed"],
    "targeted_ricochet": ["candy", "sugar", "gummy"],
    "bouncy_ball": ["gumball", "candy", "sugar"],
    "triple_split": ["candy", "sugar", "sprinkles"],
    "explosive_flavor": ["candy", "sugar", "peppermint"],
    "spell_lasting": ["candy", "sugar", "cookie"],
    "peppermint_punting": ["peppermint", "candy", "sugar"],
    "humungous_hex": ["candy", "sugar", "wafer"],
    "multiple_mint": ["peppermint", "candy", "cream"],
    "seekcandy": ["candy", "sugar", "bear"]
};

const treasureEnchantments = [
    "minecraft:frost_walker",
    "minecraft:soul_speed",
    "minecraft:swift_sneak",
    "minecraft:mending",
    "minecraft:vanishing_curse",
    "minecraft:binding_curse"
];

const namespaceList = {
    "alexscaves": alexCavesEnchantments,
    "minecraft": enchantmentWords
}

global.runningSprinklingParticles = (entity) => {
    if(Math.random()<1){
      entity.level.addParticle('minecraft:enchant', true, entity.x-0.5+2*Math.random(), entity.y-0.5+2*Math.random(), entity.z-0.5+2*Math.random(), 0, 0.5, 0)
    }
}

let count=0;
/**
 * @param {Internal.BlockEntity} entity 
 */
global.doDecipher = (entity) => {
  count++
  if(count%10 !== 0)return;
  count=0;
  let exp = findInv(entity, Item.of('create:experience_nugget'))
  if(exp === -1)return;
  let tablet = findInv(entity, Item.of('alexscaves:cave_tablet'))
  let enchant = findInv(entity, Item.of('minecraft:enchanted_book'))
  let paper = findInv(entity, Item.of('minecraft:paper'))
  let word = 'encrypted'
  let biome;
  if(entity.inventory.getItem(exp).count > 1 && paper != -1 && entity.inventory.countNonEmpty() < 9){
    if(tablet !== -1 && entity.inventory.getItem(paper).count > 3){
      biome = entity.inventory.getItem(tablet).nbt.CaveBiome.toString().split(':')[1]
      for(let i=0;i<3;i++){
        word = randomSelector(biome);
        entity.inventory.insertItem(Item.of('kubejs:wordcard',1,{Word:word, Biome:biome}),false);
      }
      entity.inventory.removeItem(tablet, 1);
      entity.inventory.removeItem(paper, 3);
      entity.inventory.removeItem(exp, 1);
      //entity.playSound('minecraft:entity.cow.milk');
    }
    if(enchant !== -1 && entity.inventory.getItem(paper).count > 3){
      let enchantWord = entity.inventory.getItem(enchant).nbt.StoredEnchantments[0].id.toString().split(':')[1]
      let namespace = entity.inventory.getItem(enchant).nbt.StoredEnchantments[0].id.toString().split(':')[0]
      let words;
      if(namespace){
        let list = namespaceList[namespace]
        words = list[enchantWord]
      }
      if(words){
        for(word of words) entity.inventory.insertItem(Item.of('kubejs:wordcard',1,{Word:word}),false);
        entity.inventory.removeItem(enchant, 1);
        entity.inventory.removeItem(paper, 3);
        entity.inventory.removeItem(exp, 1);
      }
    }
  }
}

function findInv(entity, item){
  let size = entity.inventory.getSlots();
  let index;
  for(index=0; index<size; index++){
    if(entity.inventory.getItem(index).id==item.id) return index;
  }
  return -1;
}

function randomSelector(key){
    if(key === "abyssal_chasm") return AbyssalChasm[Math.floor(AbyssalChasm.length*Math.random())]
    if(key === "magnetic_caves") return MagneticCaves[Math.floor(MagneticCaves.length*Math.random())]
    if(key === "primordial_caves") return PrimordialCaves[Math.floor(PrimordialCaves.length*Math.random())]
    if(key === "forlorn_hollows") return ForlornHollows[Math.floor(ForlornHollows.length*Math.random())]
    if(key === "toxic_caves") return ToxicCaves[Math.floor(ToxicCaves.length*Math.random())]
    if(key === "candy_cavity") return CandyCavity[Math.floor(CandyCavity.length*Math.random())]
    if(key === null || key === undefined) return key
}



  //let prop;
  //for(prop in entity.inventory){
  //  console.log(`[prop] in inv ${prop}`)
  //}
  //console.log(entity.inventory.getItem(0))
  //console.log(entity.inventory.getItem(0) == Item.of("minecraft:air"))
  //console.log(entity.inventory.getAllItems().contains(Item.of('minecraft:apple')))
  //console.log(entity.inventory.getItem(tablet).nbt.CaveBiome.toString())
        //console.log(entity.inventory.getItem(enchant).nbt.StoredEnchantments.toString())