  define(["module", "text!./service-requests-train.html", "./service-requests-train", "text!./service-requests-train.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });