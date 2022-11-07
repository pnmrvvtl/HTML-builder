const fs = require('fs');
const path = require('path');
const {mkdir, readdir, unlink, readFile, copyFile, rmdir} = require('fs/promises');

const assetsPath = path.resolve(__dirname, 'assets');
const componentsPath = path.resolve(__dirname, 'components');
const templatePath = path.resolve(__dirname, 'template.html');
const destinationPath = path.resolve(__dirname, 'project-dist');
const stylesSourcePath = path.resolve(__dirname, 'styles');
const stylesDestinationPath = path.resolve(__dirname, 'project-dist', 'style.css');
const indexDestinationPath = path.resolve(__dirname, 'project-dist', 'index.html');

async function deleteFiles(currPath) {
    let files = await readdir(path.join(destinationPath, currPath), {withFileTypes: true});
    for (const file of files) {
        if (file.isFile()) {
            await unlink(path.join(destinationPath, currPath, file.name));
        } else {
            await deleteFiles(path.join(currPath, file.name));
            await rmdir(path.resolve(destinationPath, currPath, file.name));
        }
    }
}

async function makeDistinctionFolder() {
    await mkdir(destinationPath, {recursive: true});
    let files = await readdir(destinationPath, {withFileTypes: true});
    for (const file of files) {
        if (file.isFile()) {
            await unlink(path.join(destinationPath, file.name));
        } else {
            await deleteFiles(file.name);
            await rmdir(path.resolve(destinationPath,file.name));
        }
    }
}

async function mergeStyles() {
    fs.readdir(stylesSourcePath, {withFileTypes: true}, (err, all) => {
        let files = all.filter(el => el.isFile()).filter(value => path.parse(value.name).ext.slice(1) === 'css');
        files.map(file => {
            const readableStream = fs.createReadStream(path.join(stylesSourcePath, file.name), 'utf8');

            readableStream.on('error', function (error) {
                console.log(`error: ${error.message}`);
            })

            readableStream.on('data', (chunk) => {
                fs.appendFile(stylesDestinationPath, chunk, (err) => err ? console.log(err) : 0);
            })
        })

    });
}

async function createIndex() {
    let template = '';

    await fs.readFile(templatePath, {encoding: "utf-8"}, async (error, chunk) => {
        if (error) {
            console.log(error);
            return;
        }
        template = chunk;
        let componentIndex = template.indexOf('{{');

        while (componentIndex !== -1) {
            let componentName = template.slice(componentIndex + 2, template.indexOf('}}'));
            let currCompPath = path.resolve(componentsPath, `${componentName}.html`);

            let element = await readFile(currCompPath, {encoding: 'utf8'});
            template = template.replace(`{{${componentName}}}`, element);
            componentIndex = template.indexOf('{{');
        }
        const writableStream = fs.createWriteStream(indexDestinationPath, 'utf8');
        writableStream.write(template, error => {
            if (error) {
                console.log(error);
                return;
            }
            writableStream.close();
        });
    });
}

async function copyFiles(currPath) {
    let files = await readdir(path.join(assetsPath, currPath), {withFileTypes: true});
    for (const file of files) {
        if (file.isFile()) {
            await copyFile(path.join(assetsPath, currPath, file.name), path.join(destinationPath, 'assets', currPath, file.name));
        } else {
            await mkdir(path.join(destinationPath, 'assets', currPath, file.name));
            await copyFiles(path.join(currPath, file.name));
        }
    }
}

async function copyAssets() {
    await mkdir(path.join(destinationPath, 'assets'), {recursive: true});
    let files = await readdir(assetsPath, {withFileTypes: true});

    for (const file of files) {
        if (file.isFile()) {
            await copyFile(path.join(assetsPath, file.name), path.resolve(destinationPath, 'assets', file.name));
        } else {
            await mkdir(path.join(destinationPath, 'assets', file.name));
            await copyFiles(file.name);
        }
    }
}

makeDistinctionFolder()
    .then(async () => await mergeStyles())
    .then(async () => await createIndex())
    .then(async () => await copyAssets());


