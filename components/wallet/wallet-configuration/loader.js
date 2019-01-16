define(["module", "text!./wallet-configuration.html", "./wallet-configuration", "text!./wallet-configuration.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });