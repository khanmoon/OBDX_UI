define(["module", "text!./pending-approvals-report.html", "./pending-approvals-report", "text!./pending-approvals-report.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });