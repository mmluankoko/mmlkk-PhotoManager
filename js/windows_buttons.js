const win = require('electron').remote.getCurrentWindow()
if (process.platform !== 'darwin') {
  let buttons = $('<div class="ui titlebar icon buttons"></div>')
  let b1 = $('<button class="ui button"><i class="window minimize icon"></i></button>')
  let b2 = $('<button class="ui button"><i class="window maximize icon"></i></button>')
  let b3 = $('<button class="ui button"><i class="window close icon"></i></button>')
  b1.click(() => win.minimize())
  b2.click(function() {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
    if (win.isMaximized()) {
      $(this).children().removeClass('maximize').addClass('restore')
    } else {
      $(this).children().removeClass('restore').addClass('maximize')
    }
  })
  b3.click(() => win.close())

  buttons.append(b1)
  buttons.append(b2)
  buttons.append(b3)
  $('body').append(buttons)
}
