define(["module", "text!./wallet-request.html", "./wallet-request", "text!./wallet-request.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });