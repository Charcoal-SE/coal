const EVENTS = {
  messagePosted: 1,
  messageEdited: 2,
  userJoined: 3,
  userLeft: 4,
  roomNameChanged: 5,
  messageStarred: 6,
  debugMessage: 7,
  userMentioned: 8,
  messageFlagged: 9,
  messageDeleted: 10,
  fileAdded: 11,
  moderatorFlag: 12,
  userSettingsChanged: 13,
  globalNotification: 14,
  accessLevelChanged: 15,
  userNotification: 16,
  invitation: 17,
  messageReply: 18,
  messageMovedOut: 19,
  messageMovedIn: 20,
  timeBreak: 21,
  feedTicker: 22,
  userSuspended: 29,
  userMerged: 30,
  userNameChanged: 34
}
const SMOKEY_RE = /\[ <a[^>]+>SmokeDetector<\/a>(?: \| <a[^>]+>MS<\/a>)? ] ([^:]+):(?: post \d+ out of \d+\):)? <a href="([^"]+)">(.+?)<\/a> by (?:<a href="[^"]+\/u\/(\d+)">(.+?)<\/a>|a deleted user) on <code>([^<]+)<\/code>/

function getMeta (message) {
  const matches = SMOKEY_RE.exec(message)
  if (!matches) {
    return null
  }
  matches.shift()
  const [ reasons, url, title, userId, username = 'a deleted user', site ] = matches
  return {
    url,
    title,
    userId,
    username,
    reasons: reasons.split(', '),
    site
  }
}

const win = require('electron').remote.getCurrentWindow()
const app = require('electron').remote.app
const Notification = window.Notification

setTimeout(() => {
  window.Notification = window.localStorage.disableNotifications ? null : window.Notification
})
console.log('Hi! If you don’t want desktop notifications from replies, set `localStorage.disableNotifications` to a non-empty string and reload (Cmd+R/Ctrl+R).')

const clearBadge = () => app.setBadgeCount(0)
win.on('focus', clearBadge)
window.addEventListener('beforeunload', () => win.removeListener('focus', clearBadge))

exports = module.exports = event => {
  if (event.event_type === EVENTS.messagePosted) {
    addButtons()
    if (!win.isFocused() && app.setBadgeCount) {
      app.setBadgeCount(app.getBadgeCount() + 1)
      app.dock && app.dock.bounce()
    }
    if (event.user_id === 120914) {
      const meta = getMeta(event.content)
      if (meta) {
        const notif = new Notification('SmokeDetector Report', {
          body: `${meta.site}: ${meta.reasons.join(', ')}`
        })
        notif.addEventListener('click', () => {
          if (window.fire) {
            window.fire.openReportPopup(window.$('#message-' + event.message_id))
          } else {
            require('./popup')(meta.url)
          }
        })
      } else {
        console.log('Bad message', event.content)
      }
    }
  }
}

exports.addButtons = addButtons

function addButtons () {
  setTimeout(() => {
    const $ = window.jQuery
    $('.message').each((i, el) => {
      const $el = $(el)
      const message = getMeta($el.find('.content').html())
      if (message && !$el.find('.meta .openMS').length) {
        $el.find('.meta').prepend('\xA0\xA0').prepend(
          $('<a>')
            .attr('href', 'javascript:void 0')
            .addClass('openMS')
            .text('Flag it!')
            .click(() => {
              if (window.fire) {
                window.fire.openReportPopup($el)
              } else {
                require('./popup')(message.url)
              }
              return false
            })
        )
      }
    })
  }, 1000)
}
