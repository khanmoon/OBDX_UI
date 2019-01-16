define(["module", "text!./service-requests-base.html", "./service-requests-base", "text!./service-requests-base.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });