#!/usr/bin/env node

var stdin = process.stdin;
var stdout = process.stdout;
var strChunks = [];
var exec = require("child_process").exec;

stdin.resume();
stdin.setEncoding("utf8");

stdin.on("data", function (chunk) {
    strChunks.push(chunk);
});

stdin.on("end", async function () {
    var inputJSON = strChunks.join();
    var eslintResults = JSON.parse(inputJSON);
    for (let i = 0; i < eslintResults.length; i++) {
        if (eslintResults[i].messages.length) {
            for (let j = 0; j < eslintResults[i].messages.length; j++) {
                eslintResults[i].messages[j].authorName = await svnBlame(eslintResults[i].filePath, eslintResults[i].messages[j].line);
            }
        }
    }
    var result = require("./eslint-formatter")(eslintResults);
    stdout.write(result);
});

function svnBlame(fileName, lineNumber) {
    return new Promise(function (resolve, reject) {
        exec(`cd ../ && svn blame --xml ${fileName}`, {
            maxBuffer: 20000 * 1024
        }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            return resolve(`Author: ${stdout.match(new RegExp(`line-number=\\"${lineNumber}\\"[\\s\\S]*\\<author>(.*)\\<\\/author\\>`))[1]}`);
        });
    });
}