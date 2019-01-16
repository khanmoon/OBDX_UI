define(["module", "text!./web-services.html", "./web-services", "text!./web-services.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });