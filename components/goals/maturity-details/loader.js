define(["module", "text!./maturity-details.html", "./maturity-details", "text!./maturity-details.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });