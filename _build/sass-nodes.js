var endTime, startTime = Date.now();
var sass = require('node-sass');
var fs = require('fs');
process.chdir(process.argv[2]);
var fileName = process.argv[3] || 'main';
sass.render({
    file: `${fileName}.scss`,
    outputStyle: 'compressed',
    sourceMapEmbed : true
}, function(error, result) {
    if (error) {
        console.log('status:', error.status);
        console.log('column:', error.column);
        console.log('message:', error.message);
        console.log('line:', error.line);
        console.log('error:', error);
        throw new Error(error);
    } else {
        fs.writeFileSync(`../css/${fileName}.css`, result.css);
    }
});
