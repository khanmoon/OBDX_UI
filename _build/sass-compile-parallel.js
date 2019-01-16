console.time('Time taken');
const execa = require('execa');
const Listr = require('listr');
process.chdir(__dirname);
const tasks = new Listr([{
    title: 'framework css',
    task: () => execa('node', ['sass-nodes.js', '../framework/sass/'])
}, {
    title: 'loader css',
    task: () => execa('node', ['sass-nodes.js', '../framework/sass/', 'loader'])
}, {
    title: 'obdx-font css',
    task: () => execa('node', ['sass-nodes.js', '../framework/sass/', 'obdx-font'])
},{
    title: 'component css',
    task: () => execa('node', ['component-sass.js'])
}], {
    concurrent: true
});

tasks.run().catch(err => {
    console.error(err);
    process.exit(1);
}).then(result => {
    console.timeEnd('Time taken');
});
