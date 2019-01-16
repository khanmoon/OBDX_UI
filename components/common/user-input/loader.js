define(["module", "text!./user-input.html", "./user-input", "text!./user-input.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });