define(["module", "text!./payee-details.html", "./payee-details", "text!./payee-details.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });