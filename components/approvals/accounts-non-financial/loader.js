define(["module", "text!./accounts-non-financial.html", "./accounts-non-financial", "text!./accounts-non-financial.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });