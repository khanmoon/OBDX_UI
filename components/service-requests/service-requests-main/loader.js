define(["module", "text!./service-requests-main.html", "./service-requests-main", "text!./service-requests-main.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });