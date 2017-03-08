const { shell, remote: { BrowserWindow } } = require('electron')
const path = require('path')
const fs = require('fs')

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
        } else if (this.hostname === 'm.erwaysoftware.com' || this.hostname === 'metasmoke.erwaysoftware.com') {
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
    $('head').append($('<style>').text(fs.readFileSync(path.resolve(__dirname, 'style.css'), 'utf8')))
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
            preload: path.resolve(__dirname, 'ms/preload.js'),
            nodeIntegration: false
          }
        })
        _ms.once('closed', () => {
          _ms = null
        })
        _ms.loadURL(url || 'https://metasmoke.erwaysoftware.com')
      } else {
        _ms.focus()
        _ms.webContents.executeJavaScript('(' + String(() => {
          if (window.Turbolinks && window.Turbolinks.visit) {
            window.Turbolinks.visit(url)
          } else {
            window.location.href = url
          }
        }).replace(/\burl\b/g, '"' + (url.replace(/"/g, '\\"') || '/') + '"') + ')()')
      }
    }
    handle.addButtons()
    $('#getmore, #getmore-mine').click(handle.addButtons)
    window.CHAT.addEventHandlerHook(handle)

    function injectUserScript (scriptUrl) {
      $.get(scriptUrl, data => {
        let sections = data.split('// ==/UserScript==')
        let metaData = sections[0].split('// @')
        let code = sections[1]
        let info = {
          excludes: [],
          includes: [],
          matches: [],
          grant: [],
          resources: [],
          header: '\n' + sections[0].replace(/.+[\r\n]+/, '') + '//'
        }
        let keyOverrides = {exclude: 'excludes', include: 'includes', match: 'matches', resource: 'resources', grant: 'grant'}

        metaData.shift()
        metaData.forEach(row => {
          let split = row.trim().split(/ (.+)/)
          let key = split[0]
          let value = split[1].trim()
          let altKey = keyOverrides[key]

          if (altKey) {
            info[altKey].push(value)
          } else {
            info[key] = value
          }
        })

        window.GM_info = { }
        window.GM_info[info.name] = info // A userscript will have to use `var cachedInfo = GM_info.script || GM_info["userscript name"];`

        $('head').append(
          $('<script />').text(code)
        )
      }, 'text')
    }

    function getUserScripts (...names) {
      return $.get(
        'https://api.github.com/repos/Charcoal-SE/Userscripts/commits/master',
        ({ sha }) => names.map(name => injectUserScript(`https://cdn.rawgit.com/Charcoal-SE/Userscripts/${sha}/${name}.user.js`))
      )
    }

    getUserScripts(
      'autoflagging',
      'fire/fire'
    )

    $.getScript('https://sechat.quickmediasolutions.com/js/chatstatus.js')
  })
})
