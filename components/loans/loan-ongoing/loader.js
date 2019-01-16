define(["module", "text!./loan-ongoing.html", "./loan-ongoing", "text!./loan-ongoing.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });