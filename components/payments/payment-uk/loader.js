define(["module", "text!./payment-uk.html", "./payment-uk", "text!./payment-uk.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });