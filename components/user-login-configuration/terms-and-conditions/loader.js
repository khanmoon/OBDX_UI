define(["module", "text!./terms-and-conditions.html", "./terms-and-conditions", "text!./terms-and-conditions.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });