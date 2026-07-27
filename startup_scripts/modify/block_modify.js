BlockEvents.modification(event => {
  event.modify('cataclysm:emp', block => {
    block.destroySpeed = 1.0
  })
})