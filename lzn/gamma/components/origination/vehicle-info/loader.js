define(["module", "text!./vehicle-info.html", "./vehicle-info", "text!./vehicle-info.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });