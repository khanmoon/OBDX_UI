define(["module", "text!./wallet-activity-card.html", "./wallet-activity-card", "text!./wallet-activity-card.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });