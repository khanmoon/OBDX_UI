var fs = require('fs');
var glob = require("multi-glob").glob;
const path = require('path');
glob(['../partials/help/*.html'
  ],
  function(err, files) {
    "use strict";
    if (err) throw err;
    for (var l = files.length, fileIndex = l; fileIndex--;) {
      var data = fs.readFileSync(files[fileIndex], 'utf-8');
      if (data) {
        var textContent = data.match(/>[\w\d\.\"\'\-\!\,\?][\w\d\.\"\'\-\!\:\,\?\s]+\</g);
        if(textContent){
          console.log(files[fileIndex]);
          var outFile = path.join('../ua/help/', path.parse(files[fileIndex]).base);
          fs.writeFileSync(outFile, data, 'utf8');
        }
      }
    }
  });
