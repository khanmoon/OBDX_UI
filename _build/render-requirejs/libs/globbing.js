var glob = require("multi-glob").glob;

module.exports = function() {
    return new Promise(function(resolve, reject) {
        glob([
                '../lzn/*/components/*/*/!(model|loader|hooks).js',
                '../lzn/*/components/widgets/*/*/!(model|loader|hooks).js',
                '../components/*/*/!(model|loader|hooks).js',
                '../extensions/components/*/*/!(model|loader|hooks).js',
                '../components/widgets/*/*/!(model|loader|hooks).js',
                '../framework/elements/*/*/!(model|loader|hooks).js'
            ],
            function(err, files) {
                if (err) throw err;
                var moduleDep = [];
                for (var l = files.length, fileIndex = l; fileIndex--;) {
                    var fullPath = (tokens = files[fileIndex].split("/"), tokens.shift(), tokens[tokens.length - 1] = "loader", tokens.join("/"));
                    moduleDep.push(`{\nname:'${fullPath}',\nexclude:['text', 'css', 'ojL10n','json']\n}`);
                }
                moduleDep = moduleDep.join(",");
                return moduleDep !== "" ? resolve(moduleDep) : reject(new Error('Error in globber script. Please contact author.'));
            });
    });
};