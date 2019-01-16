define(["module", "text!./confirmation.html", "./confirmation", "text!./confirmation.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });