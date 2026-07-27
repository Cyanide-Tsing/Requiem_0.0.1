ServerEvents.recipes(event=>{
    event.custom({
        "type":"createaddition:charging",
        "input": {
            "item": "minecraft:terracotta",
            "count": 1
        },
        "result": {
            "item": "minecraft:terracotta",
            "count": 1
        },
        "energy": 40000,
        "maxChargeRate": 40000
    }).id("requiem:charging/electricity_dump")
})