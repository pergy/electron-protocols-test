const url = require('url')
const fs = require('fs')
const path = require('path')

let rebaseProtBase_ = ''

const toFilePath = (customProtocolURL) => {
  return url.fileURLToPath(
    customProtocolURL.replace(/^.*\/\//, 'file://')
  )
}

module.exports = {
  myfilehandler: (request, callback) => {
    const filepath = toFilePath(request.url)
    callback(fs.existsSync(filepath)
      ? { path: filepath, headers: {"Accept-Charset": "utf-8"} }
      : { error: -6 }
    )
  },
  myimghandler: (request, callback) => {
    const filepath = toFilePath(request.url)
    const imgurl = request.url.replace('myimg', 'file')
    callback(fs.existsSync(filepath) ? {
      mimeType: 'text/html',
      charset: 'utf-8',
      data: `
      <!DOCTYPE html>
      <html>
        <head>
          <style type="text/css">
            body {
              background-image:    url('${imgurl}');
              background-size:     contain;
              background-repeat:   no-repeat;
              background-position: center center;
              background-color:    #fff;
            }
            html, body {
              width: 100%;
              height: 100%;
              margin: 0px;
              padding: 0px;
            }
          </style>
        </head>
        <body></body>
      </html>
      `
    } : { error: -6 })
  },
  setbase: (rebaseProtBase) => rebaseProtBase_ = rebaseProtBase,
  myrebasehandler: (request, callback) => {
    let filepath = path.parse(toFilePath(request.url))
    console.log(filepath)
    filepath.dir = rebaseProtBase_
    filepath = path.format(filepath)
    // filepath = path.resolve(rebaseProtBase_, './' + filepath)
    console.log(filepath)
    const newurl = url.pathToFileURL(filepath)
    newurl.hash = new URL(request.url).hash
    console.log(newurl)
    callback(fs.existsSync(filepath)
      ? {
        mimeType: 'text/html',
        charset: 'utf-8',
        data: 'http://google.com'
      }
      : { error: -6 }
    )
  }
}