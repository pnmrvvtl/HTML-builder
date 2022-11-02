const path = require('path');
const fs = require('fs');


let filePath = path.resolve(__dirname, 'secret-folder');

fs.readdir(filePath, {withFileTypes: true},(err, all) => {
    let files = all.filter(el => el.isFile());
    files.map( el => {
        let file = path.resolve(filePath, el.name);
        fs.stat(file,(err1, stats) => {
            console.log(path.parse(el.name).name, ' - ', path.parse(el.name).ext.slice(1), ' - ', `${+(stats.size / 1024).toFixed(3)}kb`);
        });
    });
});
