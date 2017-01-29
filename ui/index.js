const handle = require('./messages')

let roomId
setTimeout(() => {
  roomId = +window.location.href.match(/\/rooms\/(\d+)\//)[1]
  const { shell } = require('electron')
  // open links externally by default
  window.addEventListener('load', () => {
    window.jQuery(document).on('click', 'a[href]', function (event) {
      if (!event.isDefaultPrevented()) {
        event.preventDefault()
        shell.openExternal(this.href)
      }
    })
  })
})

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

const _ws = window.WebSocket
window.WebSocket = function WebSocket (...args) {
  const ws = new _ws(...args)
  init(ws)
  window.WebSocket = _ws
  return ws
}
