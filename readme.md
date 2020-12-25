# StreamSaver

## Install / Build

1. Install (Node.js)[https://nodejs.org/en/]
In shell / cmd
2. `npm i -g pkg`
3. `npm i`
4. `npm run pack`
  
Your build will be located at ./dist folder

## Mode

#### Without flag specifying

Source url & destination url will be prompted from console

#### Bulk flag

Example: `streamsaver.exe bulk`  
  
Sources will be taken from `list.json` file located nearby with executable.  

**list.json** file structure:
```json
[
	{
		"src": "https://url.webm",
		"dst": "file_record.webm"
	}
]
```