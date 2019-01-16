define(["module", "text!./block-card.html", "./block-card", "text!./block-card.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });