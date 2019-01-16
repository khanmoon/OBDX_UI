define(["module", "text!./dummy-merchant-dashboard.html", "./dummy-merchant-dashboard", "text!./dummy-merchant-dashboard.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });