define(["module", "text!./payment-domestic.html", "./payment-domestic", "text!./payment-domestic.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });