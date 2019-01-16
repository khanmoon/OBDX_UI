define(["module", "text!./payment-sepa.html", "./payment-sepa", "text!./payment-sepa.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });