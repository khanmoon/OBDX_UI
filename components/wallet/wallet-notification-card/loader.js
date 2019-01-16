define(["module", "text!./wallet-notification-card.html", "./wallet-notification-card", "text!./wallet-notification-card.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });