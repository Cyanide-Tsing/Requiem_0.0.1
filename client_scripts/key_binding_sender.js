ClientEvents.tick((event) => {
  const key = global.prevKey;
  const { player } = event;
  if (key.consumeClick()) {
    player.sendData("global.prevKey.consumeClick");
  }
});

ClientEvents.tick((event) => {
  const key = global.burnKey;
  const { player } = event;
  if (key.consumeClick()) {
    player.sendData("global.burnKey.consumeClick");
  }
});