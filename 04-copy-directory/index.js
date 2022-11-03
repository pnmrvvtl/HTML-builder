const path = require('path');
const fs = require('fs');

let filePath = path.resolve(__dirname, 'files-copy');
let fileOrigin = path.resolve(__dirname, 'files');

fs.mkdir(filePath, {recursive: true}, (err, path1) => {
    fs.readdir(filePath, (err, files) => {
        if (err) return;

        for (const file of files) {
            fs.unlink(path.join(filePath, file), (err) => {
                if (err) return;
            });
        }
    });

    fs.readdir(fileOrigin, (err, files) => {
        if (err) return;

        for (const file of files) {
            fs.copyFile(path.join(fileOrigin, file), path.join(filePath, file), (err) => {
                if (err) return;
            });
        }
    });
})


//fs.copyFile