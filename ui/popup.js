const _runInWindow = $ => {
  // run in the context of the opened window.
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
const onLoad = (f) => {
  return String(() => {
    const _f = $$f // eslint-disable-line
    if (document.readyState === 'complete') {
      _f(window.jQuery)
    } else {
      window.jQuery(window).on('load', _f)
    }
  }).replace('$$f', f)
}
const addUserScripts = require('./user-scripts')
module.exports = message => {
  const _w = window.open(message.url)
  _w.eval(`(${onLoad(_runInWindow)})()`)
  _w.eval(`(${onLoad(addUserScripts)})()`)
}
