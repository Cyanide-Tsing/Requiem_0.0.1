const $KeyMapping = Java.loadClass("net.minecraft.client.KeyMapping");
const $GLFWkey = Java.loadClass("org.lwjgl.glfw.GLFW");
const $KeyMappingRegistry = Java.loadClass(
  "dev.architectury.registry.client.keymappings.KeyMappingRegistry"
);
 
global.prevKey = new $KeyMapping(
  "key.keybinding.word_preview",
  $GLFWkey.GLFW_KEY_J,
  "key.kubejs.requiem_native"
);

global.burnKey = new $KeyMapping(
  "key.keybinding.burn_wordcard",
  $GLFWkey.GLFW_KEY_TAB,
  "key.kubejs.requiem_native"
);
 
ClientEvents.init(() => {
  $KeyMappingRegistry.register(global.prevKey);
  $KeyMappingRegistry.register(global.burnKey);
});