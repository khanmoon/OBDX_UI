define(["module", "text!./review-mapping-create.html", "./review-mapping-create", "text!./review-mapping-create.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });