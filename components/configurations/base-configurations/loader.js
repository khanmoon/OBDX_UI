define(["module", "text!./base-configurations.html", "./base-configurations", "text!./base-configurations.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });