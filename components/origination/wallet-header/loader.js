define(["module", "text!./wallet-header.html", "./wallet-header", "text!./wallet-header.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });