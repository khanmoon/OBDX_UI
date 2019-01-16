define(["module", "text!./record-approval.html", "./record-approval", "text!./record-approval.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });