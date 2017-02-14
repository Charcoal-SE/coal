const { shell, remote: { BrowserWindow } } = require('electron')
const path = require('path')

const handle = require('./messages')

setTimeout(() => {
  window.addEventListener('load', () => {
    const $ = window.jQuery
    // open links externally by default
    $(document).on('click', 'a[href]', function (event) {
      if (!event.isDefaultPrevented()) {
        event.preventDefault()
        if (this.textContent === 'logged in') {
          window.open(this.href)
        } else if (this.hostname === 'm.erwaysoftware.com') {
          openMetaSmoke(this.href)
        } else {
          shell.openExternal(this.href)
        }
      }
    })
    // metasmoke popup
    $('.fl').append(
      $('<a>').addClass('button').text('metasmoke').click(() => openMetaSmoke())
    )
    $('.mob #header .variant').filter('.default, .select-message').find('.left').append(
      $('<button>').addClass('title').css({
        fontWeight: 'normal',
        position: 'absolute',
        top: 0,
        border: 'none',
        background: 'transparent',
        color: 'white'
      }).text('metasmoke').append($('<code> ↗</code>').css('font-family', 'Fira Code, Fira Mono, monospace')).click(openMetaSmoke)
    )
    $('head').append($('<style>').text(require('./styles')))
    let _ms
    window.addEventListener('beforeunload', () => {
      _ms && _ms.close()
    })
    function openMetaSmoke (url) {
      if (_ms && _ms.closed) {
        _ms = null
      }
      if (!_ms) {
        _ms = new BrowserWindow({
          titleBarStyle: 'hidden-inset',
          width: 1100,
          webPreferences: {
            preload: path.resolve('ui/ms/preload.js'),
            nodeIntegration: false
          }
        })
        _ms.once('closed', () => {
          _ms = null
        })
        _ms.loadURL(url || 'https://metasmoke.erwaysoftware.com')
      } else {
        _ms.focus()
      }
    }
    handle.addButtons()
    $('#getmore, #getmore-mine').click(handle.addButtons)
    window.CHAT.addEventHandlerHook(handle)

    function getUserScripts (...names) {
      return $.get(
        'https://api.github.com/repos/Charcoal-SE/Userscripts/commits/master',
        ({ sha }) => names.map(name => $.getScript(`https://cdn.rawgit.com/Charcoal-SE/Userscripts/${sha}/${name}.user.js`))
      )
    }

    $.getScript('https://sechat.quickmediasolutions.com/js/chatstatus.js')
    getUserScripts(
      'autoflagging'
    )
  })
})
