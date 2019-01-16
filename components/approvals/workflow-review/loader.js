define(["module", "text!./workflow-review.html", "./workflow-review", "text!./workflow-review.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });