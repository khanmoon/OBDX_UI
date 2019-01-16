define(["module", "text!./variable-configurations.html", "./variable-configurations", "text!./variable-configurations.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });