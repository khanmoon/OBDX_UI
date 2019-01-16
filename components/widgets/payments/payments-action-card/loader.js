define(["module", "text!./payments-action-card.html", "./payments-action-card", "text!./payments-action-card.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });