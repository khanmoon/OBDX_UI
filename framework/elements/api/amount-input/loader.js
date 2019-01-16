define(["module", "text!./amount-input.html", "./amount-input", "text!./amount-input.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });