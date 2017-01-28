const _runInWindow = () => {
  const f = $ => {
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
  }
  if (document.readyState === 'complete') {
    f(window.jQuery)
  } else {
    window.jQuery(window).on('load', f)
  }
}
const addUserScripts = require('./user-scripts')
module.exports = message => {
  const _w = window.open(message.url)
  _w.eval(`(${_runInWindow})()`)
  _w.eval(`(${addUserScripts})()`)
  window._w = _w
  window._runInWindow = _runInWindow
}
