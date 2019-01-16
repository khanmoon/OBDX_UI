define(["module", "text!./wallet-add.html", "./wallet-add", "text!./wallet-add.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });