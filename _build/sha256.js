const hash = require('crypto').createHash;
const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;
const glob = require('multi-glob').glob;
var metaTag = "<meta http-equiv=\"Content-Security-Policy\" content=\"script-src 'self' 'unsafe-eval' 'sha256-xyz'\">";
glob([
    '../admin/pages/*.html',
    '../corporate/pages/*.html',
    '../retail/pages/*.html',
    '../index/pages/*.html',
    '../gateway/pages/*.html',
    '../wallet/pages/*.html'
], function(err, files) {
    if (err) {
        throw err;
    }
    for (var l = files.length, fileIndex = l; fileIndex--;) {
        var data = readFileSync(files[fileIndex], 'utf-8');
        var scriptTag = data.match(/<script>(.*?)<\/script>/);
        if (scriptTag) {
            var sha256Hash = hash('sha256').update(scriptTag[1]).digest('base64');
            metaTag = metaTag.replace('xyz', sha256Hash);
            data = data.replace(/(<head>)/, `$1${metaTag}`);
            writeFileSync(files[fileIndex], data, 'utf-8');
        }
    }
});
