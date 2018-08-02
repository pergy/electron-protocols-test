const { app, BrowserWindow, protocol } = require('electron')
const path = require('path')
const fs = require('fs')

// protocol.registerStandardSchemes(['test'])
// screws up incoming request.url wtf

app.once('ready', () => {
  protocol.registerHttpProtocol('test', (request, callback) => {
    console.log('test http protocol called with', request.url)
    request.url = request.url.indexOf('.html') < 0
      ? request.url.replace(/^test:\/\//i, 'testfile://')
      : request.url.replace(/^test:\/\//i, 'testbuffer://')
    try {
      callback({
        url: request.url,
        method: request.method
      })
    } catch (e) {
      callback(-6)
    }
  }, (error) => {
    if (error) console.error('Failed to register test protocol')
  })
  protocol.registerBufferProtocol('testbuffer', (request, callback) => {
    console.log('test buffer protocol called with', request.url)
    request.url = request.url.replace(/^testbuffer:\/\//i, '')
    try {
      fs.readFile(request.url, (err, data) => {
        if (err) {
          callback(-6)
        } else {
          callback(Buffer.from(data))
        }
      })
    } catch (e) {
      callback(-6)
    }
  }, (error) => {
    if (error) console.error('Failed to register testbuffer protocol')
  })
  protocol.registerFileProtocol('testfile', (request, callback) => {
    console.log('test file protocol called with', request.url)
    request.url = request.url.replace(/^testfile:\/\//i, '')
    try {
      callback(path.normalize(request.url))
    } catch (e) {
      callback(-6)
    }
  }, (error) => {
    if (error) console.error('Failed to register testfile protocol')
  })
  let win = new BrowserWindow()
  const testPath = path.normalize(path.resolve(__dirname, 'test.html'))

  win.loadURL(`test://${testPath}`)
  // Also OK with win.loadURL(`testfile://${testPath}`)
  // win.webContents.openDevTools({mode: 'detach'})
})
