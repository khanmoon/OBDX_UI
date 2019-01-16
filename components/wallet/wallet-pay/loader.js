define(["module", "text!./wallet-pay.html", "./wallet-pay", "text!./wallet-pay.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });