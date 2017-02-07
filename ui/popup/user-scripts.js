module.exports = ($) => {
  function getUserScripts (...names) {
    return $.get(
      'https://api.github.com/repos/Charcoal-SE/Userscripts/commits/master',
      ({ sha }) => names.map(name => $.getScript(`https://cdn.rawgit.com/Charcoal-SE/Userscripts/${sha}/${name}.user.js`))
    )
  }
  getUserScripts(
    'gas-mask-se',
    'fdsc'
  )
}
