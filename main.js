const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const dialog = require('electron').dialog

const path = require('path')
const url = require('url')
const menuTemplate = require('./menu_template.js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let indexWin, viewerWin

function createWindow () {
  // Create the browser window.
  indexWin = new BrowserWindow({width: 800, height: 600,
                           minWidth: 800, minHeight: 600,
                           frame: false, titleBarStyle: 'hidden',
                           title: '', show: false})
  indexWin.show()

  // and load the index.html of the app.
  indexWin.loadURL(url.format({
    pathname: path.join(__dirname, 'viewer.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  indexWin.webContents.openDevTools()

  // Emitted when the window is closed.
  indexWin.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    indexWin = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  const menu = Menu.buildFromTemplate(menuTemplate.getTemplate())
  Menu.setApplicationMenu(menu)
  createWindow();
  let imgSrc = dialog.showOpenDialog({properties: ['openFile']})[0]
  indexWin.webContents.send('img-src', imgSrc);

})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (indexWin === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
