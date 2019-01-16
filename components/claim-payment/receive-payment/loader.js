define(["module", "text!./receive-payment.html", "./receive-payment", "text!./receive-payment.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });