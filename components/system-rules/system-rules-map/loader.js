define(["module", "text!./system-rules-map.html", "./system-rules-map", "text!./system-rules-map.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });