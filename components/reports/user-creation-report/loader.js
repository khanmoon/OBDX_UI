define(["module", "text!./user-creation-report.html", "./user-creation-report", "text!./user-creation-report.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });