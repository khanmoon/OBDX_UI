define(["module", "text!./review-user-map.html", "./review-user-map", "text!./review-user-map.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });