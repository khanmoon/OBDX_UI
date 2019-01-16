define(["module", "text!./service-requests-list.html", "./service-requests-list", "text!./service-requests-list.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });