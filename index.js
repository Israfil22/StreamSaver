const fs = require('fs')
const cli = require('./src/cli')
const createDownloader = require('./src/download')

const SIZE_MB_DIVIDER = 1024 * 1024

const args = cli.parseArgs()

const downloadCertain = async (url, path) => {
    const downloader = createDownloader()

    downloader.onStart((size) => {
        console.log(`Download started. [Size: ${(size / SIZE_MB_DIVIDER).toFixed(2)}mb]`)

        setTimeout(()=>{
            downloader.onPart((total, current) =>{
                console.clear()

                const totalInMB     = total / SIZE_MB_DIVIDER
                const currentInMB   = current / SIZE_MB_DIVIDER
                const percents      = current / total * 100

                console.log(`Total: ${totalInMB.toFixed(2)}mb | Downloaded: ${currentInMB.toFixed(2)}mb | Percents: ${percents.toFixed(2)}`)
            })
        }, 1000)
    })

    const res = await downloader.download(url, path)

    console.log(`Successfully downloaded. Total size ${(res / SIZE_MB_DIVIDER).toFixed(2)}mb`)
}

const downloadBulk = async (list = [{src: '', dst: ''}]) => {
    const log = {
        header: '',
        loads: []
    }

    const getProgressBar = (current, max) => {
        const signs = Math.floor(current / max * 10)
        return [`[${'='.repeat(signs - 1 >=0 ? signs - 1 : 0)}>${' '.repeat(10 - signs)}]`]
    }

    const viewLog = () => {
        console.clear()
        console.log([log.header, ...log.loads].join('\n'))
    }

    const intervalHandler = setInterval(viewLog,300)


    for (const entry of list) {
        const downloader = createDownloader()

        const currentIndex = list.indexOf(entry)

        log.header = `[${currentIndex + 1} / ${list.length}]`

        log.loads.push('Waiting for download...')


        downloader.onEnd(() => {
            clearInterval(intervalHandler)
        })

        downloader.onPart((total, current) => {

            const totalInMB     = total / SIZE_MB_DIVIDER
            const currentInMB   = current / SIZE_MB_DIVIDER
            const percents      = current / total * 100

            log.loads[currentIndex] =
                `[${currentInMB.toFixed(2)} / ${totalInMB.toFixed(2)} mb] | ${getProgressBar(current, total)} | ${percents.toFixed(2)}%`
        })


        await downloader.download(entry.src, entry.dst)
            .catch(() => {
                log.loads[currentIndex] += ' ERROR';
            })

        viewLog()
    }

    clearInterval(intervalHandler)
}

const mainThread = async () => {
    if ('bulk' in args){
        if (!'list' in args)
            throw new Error('List argument is not provided')

        const content = await fs.promises.readFile(args.list)

        const list = JSON.parse(content)

        await downloadBulk(list)

    }
    else {
        let cliInterface = cli.createInterface()

        const url = await cli.ask(cliInterface, cli.questions.url)
        const path = await cli.ask(cliInterface, cli.questions.filePath)

        cliInterface.close()

        await downloadCertain(url, path)

    }
}

if (module.id === require.main.id)
    mainThread()

module.exports = createDownloader