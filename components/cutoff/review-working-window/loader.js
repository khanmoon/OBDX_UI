define(["module", "text!./review-working-window.html", "./review-working-window", "text!./review-working-window.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });