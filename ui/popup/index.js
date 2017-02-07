const clickFlagLink = $ => {
  // run in the context of the opened window.
  if (window.location.href === 'data:text/html,chromewebdata') {
    window.close()
  }
  setTimeout(() => {
    if (!window.location.hash.length) {
      // Q
      $('#question .flag-post-link').click()
    } else {
      // A
      const $link = $(`#answer-${window.location.hash.slice(1)} .flag-post-link`)
      $link.click()
      if (!$link.length) {
        window.alert('This answer has already been deleted!')
        window.close()
      }
    }
  }, 1000)
}
const onLoad = (f) => (() => {
  const _f = $$f // eslint-disable-line
  if (document.readyState === 'complete') {
    _f(window.jQuery)
  } else {
    window.jQuery(window).on('load', _f)
  }
}).toString().replace('$$f', String(f))

const addUserScripts = require('./user-scripts')
module.exports = (url, onDeleted = x => x) => {
  const _w = window.open(url)
  _w.blur()
  _w.eval(`(${onLoad(addUserScripts)})()`)
  _w.eval(`(${onLoad(clickFlagLink)})()`)
  setTimeout(() => {
    if (_w.closed) {
      onDeleted()
    } else {
      _w.focus()
    }
  }, 500)
}
