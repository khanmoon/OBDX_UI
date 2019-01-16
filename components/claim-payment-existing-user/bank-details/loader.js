define(["module", "text!./bank-details.html", "./bank-details", "text!./bank-details.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });