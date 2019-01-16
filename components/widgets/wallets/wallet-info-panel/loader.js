define(["module", "text!./wallet-info-panel.html", "./wallet-info-panel", "text!./wallet-info-panel.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });