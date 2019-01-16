define(["module", "text!./loan-repayment.html", "./loan-repayment", "text!./loan-repayment.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });