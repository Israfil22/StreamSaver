const https = require('https')
const http  = require('http')

const fs = require('fs')
const {EventEmitter} = require('events')

const axios = require('axios')


const httpSecCheckRegexp    = /^https:\/\//
const httpCheckRegexp       = /^http:\/\//

const createDownloader = () => {
    const events = new EventEmitter()

    const onStart   = (handler) => events.on('start', handler)
    const onPart    = (handler) => events.on('chunk', handler)
    const onEnd     = (handler) => events.on('end', handler)

    const startDownload = async (readUrl, writeUrl) => {
        const fileWriteStream = fs.createWriteStream(writeUrl, {
            flags: 'w',
            encoding: 'binary',
            mode: 0o666,
            autoClose: true
        })

        const urlHeaders = await axios.head(readUrl)

        const totalSize = urlHeaders.headers['content-length']

        const downloadAgent = httpSecCheckRegexp.test(readUrl) ?
            https : httpCheckRegexp.test(readUrl) ?
                http : null

        if (!downloadAgent)
            throw new Error('Unknown protocol')

        return new Promise((resolve, reject) => {

            let downloadedSize = 0

            downloadAgent.get(readUrl, (res) => {

                events.emit('start', totalSize)

                res.once('end', ()=> {
                    res.destroy()
                    resolve(totalSize)
                })

                res.once('error', (e) => {
                    reject(e)
                })

                res.once('close', () => {
                    fileWriteStream.close()
                })

                res.on('data', chunk => {
                    downloadedSize += chunk.length

                    events.emit('chunk', totalSize, downloadedSize)
                })

                res.pipe(fileWriteStream)
            })

        })

    }

    return {
        download: startDownload,
        onStart,
        onPart,
        onEnd
    }
}

module.exports = createDownloader