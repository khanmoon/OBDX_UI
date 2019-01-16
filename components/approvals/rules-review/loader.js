define(["module", "text!./rules-review.html", "./rules-review", "text!./rules-review.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });