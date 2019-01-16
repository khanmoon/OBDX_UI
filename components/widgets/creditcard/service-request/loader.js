define(["module", "text!./service-request.html", "./service-request", "text!./service-request.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });