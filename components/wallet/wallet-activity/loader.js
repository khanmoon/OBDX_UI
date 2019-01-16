define(["module", "text!./wallet-activity.html", "./wallet-activity", "text!./wallet-activity.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });