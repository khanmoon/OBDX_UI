define(["module", "text!./loan-details.html", "./loan-details", "text!./loan-details.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });