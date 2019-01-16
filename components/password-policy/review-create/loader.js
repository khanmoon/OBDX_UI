define(["module", "text!./review-create.html", "./review-create", "text!./review-create.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });