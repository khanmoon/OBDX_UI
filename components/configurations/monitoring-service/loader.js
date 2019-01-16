define(["module", "text!./monitoring-service.html", "./monitoring-service", "text!./monitoring-service.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });