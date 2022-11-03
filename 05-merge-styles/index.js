const path = require('path');
const fs = require('fs');


let filePath = path.resolve(__dirname, 'styles');
let fileDest = path.resolve(__dirname, 'project-dist', 'bundle.css');

fs.readdir(filePath, {withFileTypes: true},(err, all) => {
    let files = all.filter(el => el.isFile()).filter(value => path.parse(value.name).ext.slice(1) === 'css');
    fs.exists(fileDest, exists => {
        if (exists) {
            fs.unlink(fileDest, (err) => err ? console.log(err) : 0);
        }
    })
    files.map(file => {
        const readableStream = fs.createReadStream(path.join(filePath, file.name), 'utf8');

        readableStream.on('error', function (error) {
            console.log(`error: ${error.message}`);
        })

        readableStream.on('data', (chunk) => {
            fs.appendFile(fileDest, chunk, (err) => err ? console.log(err) : 0);
        })
    })

});
