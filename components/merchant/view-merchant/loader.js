define(["module", "text!./view-merchant.html", "./view-merchant", "text!./view-merchant.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });