const argv = require('yargs').argv;
const fs = require('fs');
const _ = require('lodash');
const mkdirpSync = require('mkdirp');
const glob = require('glob');
const path = require('path');

let logStream = null;

if (argv.log) {
    const logPath = path.join(argv.log, 'localizations.log');
    logStream = fs.createWriteStream(logPath);
}

function log(message) {
    if (logStream) {
        logStream.write(`${message}\n`);
    }
}

function loadExtractedLocalizations() {
    const inputFolder = path.resolve(argv.inputPath);
    log(inputFolder);
    const defaultMessages = {};

    const messagesPatten = path.join(inputFolder, '**/*.json');
    log(messagesPatten);
    const messages = glob.sync(messagesPatten);
    const localizations = {};
    messages.forEach((filename) => {
        log(`Loading file ${filename}`);
        const file = fs.readFileSync(filename, 'utf8');
        const content = JSON.parse(file);
        content.forEach((item) => {
            if (!defaultMessages.hasOwnProperty(item.id) ||
                (defaultMessages.hasOwnProperty(item.id) &&
                 ((!defaultMessages[item.id] || defaultMessages[item.id] === '') && item.defaultMessage))) {
                defaultMessages[item.id] = item.defaultMessage;
            }
        });
    });
    _.forOwn(defaultMessages, (value, key) => {
        localizations[key] = {
            default: value,
            text: ''
        };
    });
    return localizations;
}

function addNewKeys(localizations, localizedMessages, addedKeys) {
    const localizationsCollection = [];
    localizationsCollection.push(localizations);
    localizationsCollection.forEach((msg) => {
        _.forOwn(msg, (value, key) => {
            if (!localizedMessages[key]) {
                if (!_.find(addedKeys, (o) => { return o === key; })) {
                    addedKeys.push(key);
                }
                localizedMessages[key] = {
                    default: value.default,
                    text: ''
                };
            }
        });
    });
}

function updateKeys(localeContent, localizations, localizedMessages, updatedKeys, removedKeys) {
    _.forOwn(localeContent, (value, key) => {
        if (localizations[key]) {
            if (localizations[key].default !== value.default) {
                if (!_.find(updatedKeys, (o) => { return o === key; })) {
                    updatedKeys.push(key);
                }
                localizedMessages[key] = {
                    default: localizations[key].default,
                    text: ''
                };
            } else if (localizations[key].default === value.default) {
                localizedMessages[key] = {
                    default: value.default,
                    text: value.text
                };
            }
        } else if (!localizations[key]) {
            if (!_.find(removedKeys, (o) => { return o === key; })) {
                removedKeys.push(key);
            }
        }
    });
}

function createLocaleFile(localizations, locale, addedKeys, updatedKeys, removedKeys) {
    const outputPath = path.resolve(argv.outputPath);
    const filePath = path.join(outputPath, `${locale}.json`);
    let localizedMessages = {};

    mkdirpSync(outputPath);

    if (fs.existsSync(filePath)) {
        log('Files updated!');
        log(filePath);
        const localeFile = fs.readFileSync(filePath, 'utf8');
        const localeContent = JSON.parse(localeFile);
        updateKeys(localeContent, localizations, localizedMessages, updatedKeys, removedKeys);
        addNewKeys(localizations, localizedMessages, addedKeys);
    } else {
        localizedMessages = localizations;
        log('File created!');
        log(filePath);
    }
    // if (locale === 'en') {
    //     _.forOwn(localizedMessages, (value) => {
    //         value.text = `${value.default}`;
    //     });
    // } else if (locale === 'nl') {
    //     _.forOwn(localizedMessages, (value) => {
    //         value.text = `${value.default}`;
    //     });
    // }
    fs.writeFileSync(filePath, JSON.stringify(localizedMessages, null, 2));
}


function processLocalizations() {
    const addedKeys = [];
    const updatedKeys = [];
    const removedKeys = [];
    let locales = [];
    locales = argv.locales.split(',');
    const extractedLocalizations = loadExtractedLocalizations();
    locales.forEach((locale) => {
        createLocaleFile(extractedLocalizations, locale, addedKeys, updatedKeys, removedKeys);
    });
    if (addedKeys.length > 0) {
        log('Added keys:');
        addedKeys.forEach((key) => {
            log(key);
        });
    }
    if (updatedKeys.length > 0) {
        log('Updated keys:');
        updatedKeys.forEach((key) => {
            log(key);
        });
    }
    if (removedKeys.length > 0) {
        log('Removed keys:');
        removedKeys.forEach((key) => {
            log(key);
        });
    }
    if (logStream) {
        logStream.end();
    }
}

processLocalizations();
