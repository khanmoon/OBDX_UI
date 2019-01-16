define(["module", "text!./vehicle-info.html", "./vehicle-info"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });