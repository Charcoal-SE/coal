const handle = require('./messages')

let roomId
setTimeout(() => {
  roomId = +window.location.href.match(/\/rooms\/(\d+)\//)[1]
  const { shell } = require('electron')
  window.addEventListener('load', () => {
    const $ = window.jQuery
    // open links externally by default
    $(document).on('click', 'a[href]', function (event) {
      if (!event.isDefaultPrevented()) {
        event.preventDefault()
        shell.openExternal(this.href)
      }
    })
    // metasmoke popup
    $('.fl').append(
      $('<a>').addClass('button').text('metasmoke').click(openMetaSmoke)
    )
    $('.mob #header .variant').filter('.default, .select-message').find('.left').append(
      $('<button>').addClass('title').css({
        fontWeight: 'normal',
        position: 'absolute',
        top: 0,
        border: 'none',
        background: 'transparent',
        color: 'white'
      }).text('Open MetaSmoke').click(openMetaSmoke)
    )
    $('head').append($('<style>').text(require('./styles')))
    let _ms
    function openMetaSmoke () {
      if (!_ms) {
        _ms = window.open('https://metasmoke.erwaysoftware.com')
      } else {
        _ms.focus()
      }
    }
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
