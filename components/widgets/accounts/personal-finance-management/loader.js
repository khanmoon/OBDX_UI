define(["module", "text!./personal-finance-management.html", "./personal-finance-management", "text!./personal-finance-management.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });