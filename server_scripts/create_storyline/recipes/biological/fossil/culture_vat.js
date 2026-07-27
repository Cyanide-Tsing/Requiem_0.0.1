ServerEvents.recipes(event=>{
    function culture_vat(result, input, duration){
        event.custom({
            "type": "fossil:culture_vat",
            "duration": duration,
            "fuel": {
                "item": "fossil:bio_goo"
            },
            "input": {
                "item": input
            },
            "result": result
        }).id("requiem:culture_vat/"+input.toString().split(":")[1])
    }

    culture_vat("kubejs:brewer_s_yeast", "kubejs:yeast_dna", 1000)
    culture_vat("kubejs:attachment_colony", "kubejs:attachment_dna", 12000)
    culture_vat("alexscaves:subterranodon_egg", "kubejs:subterranodon_dna", 6000)
    culture_vat("alexscaves:vallumraptor_egg", "kubejs:vallumraptor_dna", 6000)
    culture_vat("alexscaves:grottoceratops_egg", "kubejs:grottoceratops_dna", 6000)
    culture_vat("kubejs:egg_item_trilocaris", "kubejs:trilocaris_dna", 3000)
    culture_vat("alexscaves:tremorsaurus_egg", "kubejs:tremorsaurus_dna", 6000)
    culture_vat("alexscaves:relicheirus_egg", "kubejs:relicheirus_dna", 6000)
    culture_vat("alexscaves:atlantitan_egg", "kubejs:atlantitan_dna", 6000)
})