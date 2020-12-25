const fs = require('fs')
const http = require('https')
const readline = require('readline')
const axios = require('axios')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const GET_URL_QUEST = 'Enter url link: '
const GET_FILEPATH_QUEST = 'Enter file path: '

const ask = async (quest) => {
    return new Promise(res => {
        rl.question(quest, (link) => res(link))
    })
}

const startDownload = async (readUrl, writeUrl, prefix = '') => {
    const fileWriteStream = fs.createWriteStream(writeUrl, {
        flags: 'w',
        encoding: 'binary',
        mode: 0o666,
        autoClose: true
    })

    const urlHeaders = await axios.head(readUrl)

    const totalSize = urlHeaders.headers['content-length']

    return new Promise((resolve, reject) => {

        let downloadedSize = 0

        http.get(readUrl, (res) => {

            res.once('end', ()=> {
                fileWriteStream.close()
                res.destroy()
                resolve(totalSize)
            })

            res.once('error', (e) => {
                reject(e)
            })

            res.on('data', chunk => {
                downloadedSize += chunk.length

                console.clear()
                console.log(`${prefix}[Total: ${(totalSize / 1024 / 1024).toFixed(2)}mb] Downloaded: ${(downloadedSize / 1024 / 1024).toFixed(2)}mb | Percents: ${(downloadedSize / totalSize * 100).toFixed(2)}`)
            })

            res.pipe(fileWriteStream)
        })

    })

}


const bulkDownload = async (array = [{src: '', dst: ''}]) => {
    for (const element of array) {
        const indexOf = array.indexOf(element) + 1
        await startDownload(element.src, element.dst, `Downloading... [${indexOf} / ${array.length}]\n`)
    }
}

const certainDownload = async (src, dst) => {

    await startDownload(src, dst)
        .catch(e => {
            console.log(`Error occurred ${e}`)
        })
        .then(size => {
            console.log(`Successfully downloaded! Total size: ${(size / 1024 / 1024).toFixed(2)}mb`)
        })
}

const mainThread = async () => {
    if (process.argv.indexOf('bulk') !== -1){
        const content = await fs.promises.readFile('list.json')
        const list = JSON.parse(content)
        await bulkDownload(list)
    }
    else {
        const url = await ask(GET_URL_QUEST)
        const path = await ask(GET_FILEPATH_QUEST)
        await certainDownload(url, path)
    }
}

mainThread()
	.catch(err => {
		console.log(`Error occurred: ${err}`)
	})
    .finally(()=>{
        rl.close()
    })