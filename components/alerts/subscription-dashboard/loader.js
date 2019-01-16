define(["module", "text!./subscription-dashboard.html", "./subscription-dashboard", "text!./subscription-dashboard.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });