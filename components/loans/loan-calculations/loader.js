define(["module", "text!./loan-calculations.html", "./loan-calculations", "text!./loan-calculations.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });