const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const ipc = electron.ipcMain
const dialog = electron.dialog

const path = require('path')
const url = require('url')
const menuTemplate = require('./menu_template.js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let indexWin, viewerWin

function createWindow () {
  // Create the browser window.
  viewerWin = new BrowserWindow({width: 800, height: 600,
                           minWidth: 800, minHeight: 600,
                           frame: false, titleBarStyle: 'hidden',
                           title: '', show: true})
  // and load the index.html of the app.
  viewerWin.loadURL(url.format({
    pathname: path.join(__dirname, 'viewer.html'),
    protocol: 'file:',
    slashes: true
  }))


  // open system dialog for image's path
  let imgPath = dialog.showOpenDialog({properties: ['openFile'],filters: [{name: 'Images', extensions: ['jpg', 'png', 'bmp']}]})
  if (imgPath) {
    viewerWin.webContents.send('image-path', imgPath[0]);
  }

  // Open the DevTools.
  viewerWin.webContents.openDevTools()

  // Emitted when the window is closed.
  viewerWin.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    viewerWin = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  const menu = Menu.buildFromTemplate(menuTemplate.getTemplate())
  Menu.setApplicationMenu(menu)
  createWindow();
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
  if (viewerWin === null) {
    createWindow()
  }
})

ipc.on('open-image-file', function (event) {
  let imgPath = dialog.showOpenDialog({properties: ['openFile'],filters: [{name: 'Images', extensions: ['jpg', 'png', 'bmp']}]})
  if (imgPath) {
    viewerWin.webContents.send('image-path', imgPath[0]);
  }
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
