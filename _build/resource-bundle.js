console.time('Total Time:');
const glob = require('multi-glob').glob;
const requirejs = require('requirejs');
const fs = require('fs');
const path = require('path');
requirejs.config({
    paths: {
        'resources': '../resources',
        'ojL10n': '../framework/js/libs/oraclejet/js/libs/oj/v5.0.0/ojL10n'
    },
    nodeRequire: require
});
glob(['../resources/**/*.js'],
    function(err, files) {
        if (err) {
            throw err;
        }
        try {
            fs.mkdirSync('../dist/resources/nls/en/');
        } catch (error) {
            console.log('Couldn\'t create the directory');
        }
        for (var i = 0; i < files.length; i++) {
                var outFile = path.join('../dist/resources/nls/en/', path.parse(files[i]).base),
                    data, resource;
                try {
                    data = fs.readFileSync(files[i], 'utf8');
                } catch (e) {
                    console.log('Couldn\'t read the original file', files[i]);
                }
                data = data.replace(/\s*?\w+\s*\:\s*[A-z\.]+,?[^'"]\n/g, '');
                try {
                    fs.writeFileSync(outFile, data, 'utf8');
                } catch (error) {
                    console.log('Couldn\'t write the modified file', outFile);
                }
                try {
                    resource = requirejs(outFile);
                } catch (e) {
                    console.log('Couldn\'t require the file', outFile);
                    console.log(e);
                    process.exit(1);
                }
                if(!resource.root) throw new Error(`Invalid resource bundle: ${files[i]}`);
                var something = JSON.stringify(resource.root);
                something = `define(${something});`;
                try {
                    fs.writeFileSync(outFile, something, 'utf8');
                } catch (error) {
                    console.log('Couldn\'t write the fixed resource bundle file', outFile);
                }
        }
        console.log('\u2713 Resource bundles generated successfully');
        console.timeEnd('Total Time:');
    });
