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
class SmokeyMessage {
  constructor (message) {
    const re = /\[ <a[^>]+>SmokeDetector<\/a> \| <a[^>]+>MS<\/a> ] ([^:]+): <a href="([^"]+)">.+?<\/a> by <a href="[^"]+\/u\/(\d+)">.+?<\/a> on <code>([^<]+)<\/code>/
    if (!re.exec(message)) {
      window._re = re
      window._message = message
    }
    const [ _unused, reasons, url, userId, site ] = re.exec(message)
    _unused
    this.url = url
    this.userId = userId
    this.reasons = reasons.split(', ')
    this.site = site
  }
}
window._sm = SmokeyMessage
module.exports = event => {
  if (event.event_type === EVENTS.messagePosted) {
    if (event.user_id === 120914 || event.user_id === 161943) {
      try {
        const message = new SmokeyMessage(event.content)
        const notif = new window.Notification('SmokeDetector Report', {
          body: `${message.site}: ${message.reasons.join(', ')}`
        })
        notif.addEventListener('click', () => {
          require('./popup')(message)
        })
      } catch (e) {
        console.warn(e)
      }
    }
  }
}
