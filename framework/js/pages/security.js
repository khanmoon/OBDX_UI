(function () {
  "use strict";
  var sri = {
    //__replace_location__
  }, bustArgs = Date.now();

  require.config({
    onNodeCreated: function (node, config, module) {
      if (sri[module]) {
        node.setAttribute("integrity", sri[module]);
        node.setAttribute("crossorigin", "anonymous");
      }
    }
  });

  var load = require.load;
  require.load = function (context, module, url) {
    if (sri[module]) {
      url = url + "?hash=" + sri[module];
    } else if (module.match(/framework\/js\/(constants|base-models\/platform)\//)) {
      url += "?bust=" + bustArgs;
    }
    return load.apply(this, [context, module, url]);
  };
}());
