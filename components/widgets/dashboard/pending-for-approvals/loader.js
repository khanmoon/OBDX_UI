define(["module", "text!./pending-for-approvals.html", "./pending-for-approvals", "text!./pending-for-approvals.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });