let count=0;
global.doScribble = (entity) => {
  count++
  if(count%10 !== 0)return;
  count=0;
  //let exp = findInv(entity, Item.of('create:experience_nugget'))
  let dictionary = findInv(entity, Item.of('kubejs:dictionary'))
  let scribble = findInv(entity, Item.of('kubejs:scratch_scroll'))
  let wordcard = findInv(entity, Item.of('kubejs:wordcard'))
  let writable = findInv(entity, Item.of('kubejs:writable_wordcard'))
  let notebook = findInv(entity, Item.of('kubejs:makeshift_notebook'))
  let word = 'translational'
  if(entity.inventory.countNonEmpty() < 18){
    if(dictionary !== -1 && wordcard !== -1 && writable === -1){
        word = entity.inventory.getItem(wordcard).nbt.Word;
        if(word && !entity.inventory.getItem(dictionary).nbt.Words.contains(NBT.stringTag(word))){
            entity.inventory.getItem(dictionary).nbt.Words.push(word);
            entity.inventory.removeItem(wordcard, 1);
            entity.inventory.insertItem("minecraft:paper", false);
        }
    }
    if(scribble !== -1 && wordcard !== -1 && writable === -1){
        word = entity.inventory.getItem(wordcard).nbt.Word;
        if(word){
            entity.inventory.getItem(scribble).nbt.Words.push(word);
            entity.inventory.removeItem(wordcard, 1);
            entity.inventory.insertItem("minecraft:paper", false);
        }
    }
    if(scribble !== -1 && notebook !== -1 && writable === -1 && dictionary === -1){
        let words = entity.inventory.getItem(scribble).nbt?.Words
        let name = "<Untitled>";
        let note = entity.inventory.getItem(notebook)
        if(entity.inventory.getItem(scribble).nbt.display.Name) name = entity.inventory.getItem(scribble).nbt?.display.Name.toString().split(':')[1].split('}')[0].split("\"")[1].split("\"")[0]
        if(words && note.nbt.Content.length < 31){
            note.nbt.Content.push(words)
            note.nbt.Names.push(name)
            if(note.nbt.CurrentContent.length<1){
                note.nbt.Content[0].forEach(VALUE => {
                    note.nbt.CurrentContent.push(VALUE)
                });
                note.nbt.key = 0;
            }
            entity.inventory.removeItem(scribble, 1);
        }
    }
    if(dictionary !== -1 && writable !== -1){
        if(entity.inventory.getItem(writable).damageValue > 0){
            word = entity.inventory.getItem(writable).nbt?.display.Name.toString().split(':')[1].split('}')[0].split("\"")[1].split("\"")[0]
        }
        if(word && entity.inventory.getItem(dictionary).nbt.Words.contains(NBT.stringTag(word))){
            entity.inventory.getItem(writable).damageValue-=1;
            entity.inventory.insertItem(Item.of('kubejs:wordcard', 1, {Word: word}), false);
        }
    }
    if(scribble !== -1 && writable !== -1){
        if(entity.inventory.getItem(writable).damageValue > 0){
            let content = entity.inventory.getItem(scribble).nbt.Words[entity.inventory.getItem(scribble).nbt.Words.length-1]
            entity.inventory.insertItem(Item.of('kubejs:wordcard', 1, {Word: content}), false);
            entity.inventory.getItem(scribble).nbt.Words.remove(entity.inventory.getItem(scribble).nbt.Words.length-1);
            entity.inventory.getItem(writable).damageValue-=1;
        }
    }
  }
}

const magic = ["new", "evoke", "link", "loop", "break", "end", "if", "sense", "step", "damage", "grant", "recoil", "target", "tint", "terminate", "self", "cloud", "levitated", "burdened", "glacier", "aqua", "pyre", "fulmen", "verdure", "void", "sanguine", "divinity", "terra", "fabrication", "eldritch", "insect", "ally", "enemy", "contact", "distance", "crosshair", "range", "thrice", "random", "down", "toward"]