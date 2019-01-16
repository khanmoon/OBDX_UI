define(["module", "text!./beneficiary.html", "./beneficiary", "text!./beneficiary.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });