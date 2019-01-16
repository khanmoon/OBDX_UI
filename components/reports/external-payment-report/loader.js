define(["module", "text!./external-payment-report.html", "./external-payment-report", "text!./external-payment-report.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });