# StreamSaver


## As package using

`npm i --save https://github.com/Israfil22/stream-save.git`

or 

`npm i --save stream-save`

In code:

```js
const createDownloader = requie('stream-saver')

const downloader = createDownloader()

const MB_SIZE_DIVISOR = 1024 * 1024

downloader.onStart((total) => {
    console.log(`Total file size: ${total / MB_SIZE_DIVISOR}`)
})

downloader.onPart((total, current) => {
    console.log(`Percents: ${current / total * 100}%`)
})

downloader.onEnd((total) => {
    console.log('End')
})

downloader.download(process.env.URL, process.env.FILE)
    .then((total) => {
        console.log(`Success! Total file size: ${total / MB_SIZE_DIVISOR}`)
    })
    .catch((e) => {
        console.log(e)
        process.exit(1)
    })
```


## Install / Build

1. Install [Node.js](https://nodejs.org/en/)  
In shell / cmd
2. `npm i -g pkg`
3. `npm i`
4. `npm run pack`
  
Your build will be located at ./dist folder

## Mode

#### Without flags specifying

Source url & destination url will be prompted from console

#### Bulk flag

Example: `streamsaver.exe bulk list=all.json`  
  
Sources will be taken from `list` execute argument.  

**list.json** file structure:
```json
[
    {
        "src": "https://url_1.webm",
        "dst": "file_record_1.webm"
    },
    {
        "src": "https://url_2.webm",
        "dst": "file_record_2.webm"
    }
]
```
