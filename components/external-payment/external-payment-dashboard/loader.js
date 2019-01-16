define(["module", "text!./external-payment-dashboard.html", "./external-payment-dashboard", "text!./external-payment-dashboard.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });