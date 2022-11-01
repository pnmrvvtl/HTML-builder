const path = require('path');
const fs = require('fs');

function readFile(filePath) {
    const readableStream = fs.createReadStream(filePath, 'utf8');

    readableStream.on('error', function (error) {
        console.log(`error: ${error.message}`);
    })

    readableStream.on('data', (chunk) => {
        console.log(chunk);
    })
}


let filePath = path.resolve(__dirname, 'text.txt');

readFile(filePath);
