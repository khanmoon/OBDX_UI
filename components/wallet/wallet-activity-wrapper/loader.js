define(["module", "text!./wallet-activity-wrapper.html", "./wallet-activity-wrapper", "text!./wallet-activity-wrapper.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });