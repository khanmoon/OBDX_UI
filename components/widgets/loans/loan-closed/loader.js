define(["module", "text!./loan-closed.html", "./loan-closed", "text!./loan-closed.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });