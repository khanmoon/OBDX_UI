define(["module", "text!./map.html", "./map", "text!./map.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });