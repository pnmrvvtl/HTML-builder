const path = require('path');
const fs = require('fs');
const readline = require('readline');

function writeFile(filePath, string) {
    const writableStream = fs.createWriteStream(filePath, 'utf8');

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
        writableStream.on('finish', () => {
            console.log(`All your sentences have been written to ${filePath}`);
        })
        process.exit();
    });

}


let filePath = path.resolve(__dirname, 'file.txt');

writeFile(filePath);
