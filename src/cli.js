const readline = require('readline')

exports.questions = {
    url: 'Enter url link: ',
    filePath: 'Enter file path: '
}

exports.parseArgs = () => {
    const args = process.argv.slice(2)
    return Object.fromEntries(
        args.map(el => el.split('='))
    )
}

exports.createInterface = () => {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
}

exports.ask = (readInterface, quest) => {
    return new Promise(res => {
        readInterface.question(quest, (link) => res(link))
    })
}
