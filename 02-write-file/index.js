const path = require('path');
const fs = require('fs');
const readline = require('readline');

let filePath = path.resolve(__dirname, 'file.txt');
const writableStream = fs.createWriteStream(filePath, 'utf8');

function writeFile(filePath) {

    writableStream.on('error', function (error) {
        console.log(`error: ${error.message}`);
    })

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'Enter a sentence: '
    });

    rl.prompt();

    rl.on('line', (line) => {
        switch (line.trim()) {
            case 'exit':
                console.log(`All your sentences have been written to ${filePath}`);
                rl.close();
                break;
            default:
                let sentence = line + '\n';
                writableStream.write(sentence);
                rl.prompt();
                break;
        }
    }).on('close', () => {
        writableStream.end();
        process.exit();
    }).on("SIGINT", function () {
        process.emit("SIGINT");
    });
}

process.on('SIGINT', function () {
    console.log(`\nAll your sentences have been written to ${filePath}`);
    writableStream.end();
    process.exit();
});

writeFile(filePath);
