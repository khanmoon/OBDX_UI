define(["module", "text!./wallet-created.html", "./wallet-created", "text!./wallet-created.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });