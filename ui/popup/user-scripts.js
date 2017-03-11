module.exports = ($) => {
  function getUserScripts (...names) {
    return $.get(
      'https://api.github.com/repos/Charcoal-SE/userscripts/commits/master',
      ({ sha }) => names.map(name => $.getScript(`https://cdn.rawgit.com/Charcoal-SE/userscripts/${sha}/${name}.user.js`))
    )
  }
  getUserScripts(
    'gas-mask-se',
    'fdsc'
  )
}
