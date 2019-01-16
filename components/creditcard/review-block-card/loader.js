define(["module", "text!./review-block-card.html", "./review-block-card", "text!./review-block-card.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });