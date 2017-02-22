const { shell } = require('electron')
const path = require('path')
const fs = require('fs')

setTimeout(() => {
  window.addEventListener('load', () => {
    const $ = window.jQuery
    const navHeight = 38
    $('html').addClass(`plat-${process.platform}`)
    fs.readFile(path.resolve(__dirname, 'style.css'), 'utf8', (err, text) => {
      if (err) {
        console.error(err)
        return
      }
      $('head').append($('<style>').text(text.replace(/\$\$navHeight/g, String(navHeight))))
    })
    $(document).on('click', 'a[href]', event => {
      if (!event.isDefaultPrevented()) {
        if (event.currentTarget.host.indexOf(window.location.host) === -1 || event.currentTarget.href.endsWith('.json')) {
          event.preventDefault()
          shell.openExternal(event.currentTarget.href)
        }
      }
    })
    const onLoad = () => {
      $('.footer p:not(.history-added)').append(
        $('<span/>').addClass('history-nav').append(
          $('<a/>').addClass('glyphicon glyphicon-chevron-left').attr('title', 'Go Back').click(window.history.back)
        ).append(
          $('<a/>').addClass('glyphicon glyphicon-refresh').attr('title', 'Reload').click(() => window.history.go(0))
        ).append(
          $('<a/>').addClass('glyphicon glyphicon-chevron-right').attr('title', 'Go Forward').click(window.history.forward)
        )
      ).addClass('history-added')
    }
    onLoad()
    $(document).on('turbolinks:load', onLoad)
  })
})
