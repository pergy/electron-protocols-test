const { app, BrowserWindow, session, protocol } = require('electron')
const {
  myimghandler, myfilehandler, myrebasehandler, setbase
} = require('./utils')

/*protocol.registerSchemesAsPrivileged([
  { scheme: 'myimg', privileges: {
    secure: true,
    bypassCSP: true,
    // standard: true, // This one screws up paths !! (c:/ -> c/)
  } }
])*/

app.once('ready', () => {
  const ses = session.defaultSession
  ses.protocol.registerStringProtocol(
    'myimg',
    myimghandler,
    err => { if (err) console.error(err) }
  )
  ses.protocol.registerFileProtocol(
    'myfile',
    myfilehandler,
    err => { if (err) console.error(err) }
  )
  setbase(__dirname)
  ses.protocol.registerStringProtocol(
    'mybase',
    myrebasehandler,
    err => { if (err) console.error(err) }
  )

  const win = new BrowserWindow()
  win.webContents.on('did-fail-load', (e, code, desc) => {
    console.log('FAIL to load', code, desc)
  })
  // 1 - basic set
  // win.loadURL('myimg://c:/Users/Adell/Pictures/Untitled.jpg')
  // win.loadURL('myfile://d:/_DEV/tmp/testbatch/test.html')
  // win.loadURL('mybase://Untitled.jpg')
  // 2 - accented set
  // win.loadURL('myimg://c:/Users/Adell/Pictures/Csontváry_Kosztka_Tivadar_-_1908_-_Marokkói_tanító.jpg')
  // win.loadURL('myfile://d:/_DEV/tmp/testbatch/test - Másolat.html') // fails !!! OK with file://
  // win.loadURL('mybase://Untitled.jpg')
  // 3 - no myimg
  win.loadURL('mybase://imgviewer.html#src=c:/Users/Adell/Pictures/Untitled.jpg') // Not allowed to load (mybase ??)
  // win.loadURL('file://d:/_DEV/electron-examples/url-path-test/imgviewer.html#src=c:/Users/Adell/Pictures/Untitled.jpg')
})