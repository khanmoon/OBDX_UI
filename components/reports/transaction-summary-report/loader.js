define(["module", "text!./transaction-summary-report.html", "./transaction-summary-report", "text!./transaction-summary-report.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });