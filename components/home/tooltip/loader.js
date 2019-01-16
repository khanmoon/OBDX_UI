define(["module", "text!./tooltip.html", "./tooltip", "text!./tooltip.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });