define(["module", "text!./user-map.html", "./user-map", "text!./user-map.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });