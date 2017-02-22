const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow

function createWindow () {
  if (app.dock) {
    app.dock.setIcon('img/icon.png')
  }
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.resolve('ui/index.js')
    }
  })

  mainWindow.loadURL(`https://chat.stackexchange.com/rooms/11540/charcoal-hq`)

  mainWindow.on('closed', function () {
    if (process.platform !== 'darwin') {
      mainWindow = null
      app.quit()
    }
  })
}

app.on('ready', createWindow)
