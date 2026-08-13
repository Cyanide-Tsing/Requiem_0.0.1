StartupEvents.registry('fluid', event => {
    //Mixtures
    event.create('brine').thinTexture(0x3394b2ad).bucketColor(0x3394b2ad);
    event.create('refined_brine').thinTexture(0x3394b2ad).bucketColor(0x3394b2ad);
    event.create('raw_uranyl_solution').thickTexture(0xc4e388).bucketColor(0xc4e388);
    event.create('radioactive_waste').thickTexture(0x39ff14).bucketColor(0x39ff14).luminosity(14);
    event.create('wither_slurry').thickTexture(0x48404a).bucketColor(0x48404a);
    event.create('netherite_slurry').thickTexture(0x55251b).bucketColor(0x55251b);
    event.create('amethyst_mixture').thinTexture(0xe3b789).bucketColor(0xe3b789);
    event.create('transmutator_solution').thinTexture(0x8c4ae7).bucketColor(0x8c4ae7);
    event.create('volatile_mixture').thinTexture(0x98c1eb).bucketColor(0x98c1eb);
    event.create('polymer_substrate').thickTexture(0xe3e3bd).bucketColor(0xe3e3bd).gaseous().noBlock();

    //Pure
    event.create('chlorine').thinTexture(0xc8ff00).bucketColor(0xc8ff00).gaseous().noBucket();
    event.create('helium').thinTexture(0xc7fadf).bucketColor(0xc7fadf).density(0.1).gaseous(); 
    event.create('radon').thinTexture(0x77ff00).bucketColor(0x77ff00).gaseous().noBucket();
    event.create('mercury').thickTexture(0xffffff).bucketColor(0xffffff);

    //Molten
    event.create('ad_astra:molten_ostrum')
    event.create('ad_astra:molten_calorite')

    //acid
    event.create('hydrofluoric_acid').thinTexture(0xeefa7f).bucketColor(0xeefa7f);
    event.create('hydrochloric_acid').thinTexture(0xc6ff7c).bucketColor(0xc6ff7c);
    event.create('nitric_acid').thinTexture(0xffecb3).bucketColor(0xffecb3);

    //chloride
    event.create('ferric_chloride').thinTexture(0xdec4a2).bucketColor(0xdec4a2);
    event.create('zinc_chloride').thinTexture(0xa2cee2).bucketColor(0xa2cee2);
    event.create('copper_chloride').thinTexture(0x5176cd).bucketColor(0x5176cd);
    event.create('rednd_chloride').thinTexture(0xe388a4).bucketColor(0xe388a4);
    event.create('azund_chloride').thinTexture(0xab88e3).bucketColor(0xab88e3);
    event.create('chloroplatinic_acid').thinTexture(0xabc5e0).bucketColor(0xabc5e0);

    //nitrate
    event.create('lead_nitrate').thinTexture(0xa2cee2).bucketColor(0xa2cee2);
    event.create('silver_nitrate').thinTexture(0xefefef).bucketColor(0xefefef);
    event.create('magnesium_nitrate').thinTexture(0xeeeeee).bucketColor(0xeeeeee);
    event.create('ammonium_nitrate').thinTexture(0xaee7fa).bucketColor(0xaee7fa);
    event.create('beryllium_nitrate').thinTexture(0x7a9eff).bucketColor(0x7a9eff);
    event.create('uranyl_nitrate').thickTexture(0xc4e388).bucketColor(0xc4e388);
    event.create('netheryl_nitrate').thickTexture(0x574040).bucketColor(0x574040);

    //semicon
    event.create('silicon_tetrachloride').thinTexture(0x009f7f).bucketColor(0x009f7f).gaseous().noBlock().noBucket();
    
    //other
    event.create('sodium_hydroxide').thinTexture(0x9ab4bd).bucketColor(0x9ab4bd);
    event.create('molten_quartz').thickTexture(0xe2e3d8).bucketColor(0xe2e3d8);
    event.create('molten_cryolite').thickTexture(0x8fe6ea).bucketColor(0x8fe6ea); 

    //organic
    event.create('methane').thinTexture(0x77ffff).bucketColor(0x77ffff).gaseous();
    event.create('ethylene').thinTexture(0xf7cfff).bucketColor(0xf7cfff).gaseous(); 
    event.create('ammonia').thinTexture(0x56cd8b).bucketColor(0x56cd8b).gaseous().noBlock();
    event.create('carbon_dioxide').thinTexture(0xb6d2d2).bucketColor(0xb6d2d2).gaseous().noBlock();
    event.create('formaldehyde').thinTexture(0xb3ad36).bucketColor(0xb3ad36).gaseous().noBlock();
    event.create('tetrafluoromethane').thinTexture(0xbfbaa0).bucketColor(0xbfbaa0).gaseous().noBlock().noBucket(); 
    event.create('glycerol_nitrate').thickTexture(0xe3e3bd).bucketColor(0xe3e3bd);
    event.create('trinitrophenol').thickTexture(0xe3e3bd).bucketColor(0xe3e3bd);
    event.create('acetic_acid').thinTexture(0xa59d6e).bucketColor(0xa59d6e);
    event.create('propylene').thinTexture(0xb5b9a1).bucketColor(0xb5b9a1);
    event.create('acrylic_acid').thinTexture(0xf6ffc3).bucketColor(0xf6ffc3);
    event.create('benzene').thinTexture(0xc2a800).bucketColor(0xc2a800);
    event.create('phenylamine').thinTexture(0x565cff).bucketColor(0x565cff);
    event.create('nitrobenzene').thinTexture(0x96865cf).bucketColor(0x96865cf);
    event.create('phenol').thinTexture(0xd3e9ff).bucketColor(0xd3e9ff);
    event.create('isopropanol').thinTexture(0xa0cfff).bucketColor(0xa0cfff);
    event.create('isoprene').thinTexture(0x858534).bucketColor(0x858534).gaseous().noBlock();
    //event.create('pesticide_precursor').thinTexture(0xb98150).bucketColor(0xb98150);
    event.create('pesticide_liquid').thinTexture(0xb9340e).bucketColor(0xb9340e).noBucket();
    event.create('udmh').thinTexture(0x7545ff).bucketColor(0x7545ff);
    event.create('n2o4').thinTexture(0x8a5525).bucketColor(0x8a5525).gaseous().noBlock();
    event.create('fuel_mix').thinTexture(0xbef9ff).bucketColor(0xbef9ff);
    event.create('nitro_mix').thinTexture(0x77f1ff).bucketColor(0x77f1ff); 
    event.create('chlormethine').thinTexture(0x1fb800).bucketColor(0x1fb800).gaseous(); 
    event.create('epoxyethylene').thinTexture(0xdbefff).bucketColor(0xdbefff).gaseous(); 
    event.create('ethylene_carbonate').thinTexture(0xfaffe1).bucketColor(0xfaffe1).gaseous();

    //food
    event.create('meat_stew').thinTexture(0xd2b97f).bucketColor(0xd2b97f);
    event.create('tomato_pea_soup').thickTexture(0xb12600).bucketColor(0xb12600)
})