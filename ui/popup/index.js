const path = require('path')
const fs = require('fs')

const clickFlagLink = $ => {
  // run in the context of the opened window.
  if (window.location.href === 'data:text/html,chromewebdata') {
    window.close()
  }
  const _lP = $.fn.loadPopup
  let _prom
  $.fn.loadPopup = function () {
    _prom = _lP.apply(this, arguments)
    return _prom
  }
  const f = () => {
    if (!window.location.hash.length) {
      // Q
      $('#question .flag-post-link').click()
    } else {
      // A
      const $answer = $(`#answer-${window.location.hash.slice(1)}`)
      if (!$answer.length) {
        window.alert('This answer has already been deleted!')
        window.close()
      }
      $answer.find('.flag-post-link').click()
    }
    _prom.then(function () {
      const sel = '[value="PostSpam"]'
      const clickSpam = () => {
        if (!$(sel).length) {
          setTimeout(clickSpam, 50)
        } else {
          $(sel).click().focus()
        }
      }
      clickSpam()
    })
  }
  if (window.fdsc && window.fdsc.ready) {
    f()
  } else {
    $(document).on('fdsc:ready', f)
  }
}
const onLoad = (f) => (() => {
  const _f = $$f // eslint-disable-line no-undef
  if (document.readyState === 'complete') {
    _f(window.jQuery)
  } else {
    window.jQuery(window).on('load', _f)
  }
}).toString().replace('$$f', String(f))

const addUserScripts = require('./user-scripts')

var css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8', (err, text) => {
  if (err) {
    console.error(err)
    return
  }
})
const injectStyles = String($ => {
  console.log($('head').append($('<style>').text($$text))) // eslint-disable-line no-undef
}).replace('$$text', '`' + css.replace(/`/g, '\\`') + '`')

module.exports = (url, onDeleted = x => x) => {
  const _w = window.open(url)
  _w.eval(`(${onLoad(addUserScripts)})()`)
  _w.eval(`(${onLoad(clickFlagLink)})()`)
  _w.eval(`(${onLoad(injectStyles)})()`)
}
