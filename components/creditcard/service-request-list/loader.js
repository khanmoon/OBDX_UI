define(["module", "text!./service-request-list.html", "./service-request-list", "text!./service-request-list.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });