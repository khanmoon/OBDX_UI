define(["module", "text!./claim-payment-dashboard.html", "./claim-payment-dashboard", "text!./claim-payment-dashboard.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });