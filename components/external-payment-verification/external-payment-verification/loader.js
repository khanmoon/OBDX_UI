define(["module", "text!./external-payment-verification.html", "./external-payment-verification", "text!./external-payment-verification.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });