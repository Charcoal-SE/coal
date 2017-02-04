const { shell } = require('electron')
const fs = require('fs')

setTimeout(() => {
  window.addEventListener('load', () => {
    const $ = window.jQuery
    const navHeight = 38
    $('html').addClass(`plat-${process.platform}`)
    fs.readFile('ui/ms/style.css', 'utf8', (err, text) => {
      if (err) {
        console.error(err)
        return
      }
      $('head').append($('<style>').text(text.replace(/\$\$navHeight/g, String(navHeight))))
    })
    $(document).on('click', 'a[href]', event => {
      if (!event.isDefaultPrevented()) {
        if (event.target.host.indexOf(window.location.host) === -1 || event.target.href.endsWith('.json')) {
          event.preventDefault()
          shell.openExternal(event.target.href)
        }
      }
    })
    const onLoad = () => {
      $('ul.navbar-right:not(.history-added)').prepend(
        $('<li>').addClass('history-nav').append($('<a>').text('▶').attr('title', 'Go Forward')).click(window.history.forward)
      ).prepend(
        $('<li>').addClass('history-nav').append($('<a>').text('◀').attr('title', 'Go Back')).click(window.history.back)
      ).addClass('history-added')
    }
    onLoad()
    $(document).on('turbolinks:load', onLoad)
  })
})
