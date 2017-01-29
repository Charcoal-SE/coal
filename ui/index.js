const handle = require('./messages')

const roomId = +window.location.href.match(/\/rooms\/(\d+)\//)[1]

const init = (ws) => {
  ws.addEventListener('message', ({ data }) => {
    data = JSON.parse(data)
    const room = data['r' + roomId]
    if (room.e) {
      for (const event of room.e) {
        handle(event)
      }
    }
  })
}

const { shell } = require('electron')
// open links externally by default
window.addEventListener('load', () => {
  window.jQuery(document).on('click', 'a[href^="http"]', function (event) {
    event.preventDefault()
    shell.openExternal(this.href)
  })
})

const _ws = window.WebSocket
window.WebSocket = function WebSocket (...args) {
  const ws = new _ws(...args)
  init(ws)
  window.WebSocket = _ws
  return ws
}
