const { BrowserWindow } = require('electron')
const url = require('url')

const mutexify = require('mutexify')
const cheerio = require('cheerio')
const ora = require('ora')

let _statsWin
function initStatus (accounts) {
  _statsWin = new BrowserWindow()
  _statsWin.loadURL(`file://${__dirname}/ui/status.html`)
  _statsWin.webContents.once('did-finish-load', () => {
    _statsWin.webContents.executeJavaScript(`window.init(${JSON.stringify(accounts)})`)
  })
}

const spinner = ora('Loading Account List').start()
const _bw = new BrowserWindow({
  width: 0,
  height: 0
})
const lock = mutexify()
function fetch (url) {
  return new Promise((resolve, reject) => {
    lock(release => {
      _bw.webContents.once('did-finish-load', () => {
        _bw.webContents.executeJavaScript('document.documentElement.outerHTML', val => {
          resolve(val)
        })
        release()
      })
      _bw.loadURL(url)
    })
  }).then(cheerio.load)
}
function leftPad (str, len) {
  str = String(str)
  while (str.length < len) {
    str = ' ' + str
  }
  return str
}
function getFlagCount ({ helpful, declined, rep }) {
  let count = 10
  count += Math.floor((helpful - declined) / 10)
  count += Math.floor(rep / 2000)
  count = Math.min(count, 100)
  return Math.max(0, count)
}

fetch('http://stackexchange.com/users/current?tab=accounts')
  .then($ => {
    spinner.text = 'Collecting account data'
    return $('.account-container').toArray().map($)
  })
  .then(accounts => accounts.map($account => {
    // .account-site a === site name & user links
    // .account-icon img === site icon
    const $link = $account.find('.account-site a')
    return {
      siteName: $link.text().trim(),
      profileURL: $link.attr('href'),
      icon: $account.find('.account-icon img').attr('src'),
      hidden: $account.is('.hidden')
    }
  }).filter(account => account.siteName !== 'Area 51'))
  .then(accounts => {
    const lengthLength = String(accounts.length).length
    spinner.text = `Loading Flag Summaries ( ${leftPad(0, lengthLength)} / ${accounts.length} )`
    return Promise.all(accounts.map((account, i) => new Promise(resolve => {
      fetch(account.profileURL.replace('/users/', '/users/flag-summary/'))
        .then($ => {
          spinner.text = `Loading Flag Summaries ( ${leftPad(i + 1, lengthLength)} / ${accounts.length} )`
          const GROUPS = {
            post: 1,
            spam: 2,
            rude: 3,
            comment: 4
          }
          const STATUSES = {
            helpful: 2,
            declined: 3
          }
          let helpful = 0
          let declined = 0
          for (const group of Object.keys(GROUPS)) {
            helpful += +$(`#flag-stat-info-table a[href="?group=${GROUPS[group]}&status=${STATUSES.helpful}"]`).parent().prev().text()
            declined += +$(`#flag-stat-info-table a[href="?group=${GROUPS[group]}&status=${STATUSES.declined}"]`).parent().prev().text()
          }
          return getFlagCount({
            helpful,
            declined,
            rep: $('.reputation-score').text().replace(',', '')
          })
        })
        .then(flagCount => resolve(Object.assign({
          flagCount
        }, account)))
    })))
  })
  .then(accounts => {
    const lengthLength = String(accounts.length).length
    spinner.text = `Retrieving Flags Remaining ( ${leftPad(0, lengthLength)} / ${accounts.length} )`
    return Promise.all(accounts.map((account, i) => new Promise(resolve => {
      const info = url.parse(account.profileURL)
      info.pathname = '/flags/posts/1/popup'
      fetch(url.format(info)).then($ => {
        spinner.text = `Retrieving Flags Remaining ( ${leftPad(i + 1, lengthLength)} / ${accounts.length} )`
        resolve(Object.assign({
          usedFlags: account.flagCount - +$('.bounty-indicator-tab').text()
        }, account))
      })
    })))
  }).then(accounts => {
    spinner.succeed('Done')
    initStatus(accounts)
  }).catch(console.error)
