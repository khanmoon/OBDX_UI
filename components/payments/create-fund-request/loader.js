define(["module", "text!./create-fund-request.html", "./create-fund-request", "text!./create-fund-request.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });