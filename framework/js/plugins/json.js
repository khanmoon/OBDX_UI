define(["framework/js/constants/constants", "text"], function (Constants, text) {
  "use strict";
  var buildMap = {};
  return {
    load: function (url, req, onLoad, config) {
      var name = null;
      if (config && config.isBuild && config.inlineJSON === false) {
        onLoad();
        return;
      }
      if (url.indexOf("empty:") === 0) {
        onLoad();
        return;
      }
      if (!url.match(/local/)) {
        name = "json/" + Constants.jsonContext + "/" + url + ".json" + (config && !config.isBuild && Constants.buildFingerPrint.timeStamp ? ("?bust=" + Constants.buildFingerPrint.timeStamp) : "");
      } else {
        name = url.replace("local~", "") + ".json" + (config && !config.isBuild && Constants.buildFingerPrint.timeStamp ? ("?bust=" + Constants.buildFingerPrint.timeStamp) : "");
      }
      name = config.baseUrl + name;
      text.get(name, function (data) {
          var parsed;
          if (config.isBuild) {
            buildMap[url] = data;
            onLoad(data);
          } else {
            try {
              parsed = JSON.parse(data);
            } catch (e) {
              onLoad.error(e);
            }
            onLoad(parsed);
          }
        },
        onLoad.error, {
          accept: "application/json"
        }
      );
    },
    write: function (pluginName, moduleName, write) {
      if (buildMap[moduleName]) {
        var content = JSON.stringify(JSON.parse(buildMap[moduleName])).replace(/\s/g, "&#9760;");
        write("define(\"" + pluginName + "!" + moduleName + "\", function(){ return " + content + ";});\n");
      }
    },
    normalize: function (name, normalize) {
      return name.match("local!") ? ("local~" + normalize(name.replace("local!", ""))) : normalize(name);
    }
  };
});
