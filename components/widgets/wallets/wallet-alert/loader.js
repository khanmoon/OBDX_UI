define(["module", "text!./wallet-alert.html", "./wallet-alert", "text!./wallet-alert.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });