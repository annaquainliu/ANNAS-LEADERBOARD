const wordsFilename = 'words.json';
const fs = require('fs');

function getWords(connatation) {
    var m = JSON.parse(fs.readFileSync(wordsFilename).toString());
    return m[connatation];
}

function addWord(word, poggers) {

    var body = JSON.parse(fs.readFileSync(wordsFilename).toString());

    if (poggers && !body["wordsILike"].includes(`${word}`)) {
        body["wordsILike"].push(`${word}`);
    }
    else if (!poggers && !body["wordsIHate"].includes(`${word}`)) {
        body["wordsIHate"].push(`${word}`);
    }
    else {
        return false;
    }

    fs.writeFileSync(wordsFilename, JSON.stringify(body));
    return true;

}


function removeWord(word, poggers) {

    var body = JSON.parse(fs.readFileSync(wordsFilename).toString());

    if (poggers && body["wordsILike"].includes(`${word}`)) {
        var index = body.wordsILike.indexOf(word);
        body.wordsILike.splice(index, index);
    }
    else if (!poggers && body["wordsIHate"].includes(`${word}`)) {
        var index = body.wordsIHate.indexOf(word);
        body.wordsIHate.splice(index, index);
    }
    else {
        return false;
    }

    fs.writeFileSync(wordsFilename, JSON.stringify(body));

    return true;

}

module.exports = {getWords, addWord, removeWord};
