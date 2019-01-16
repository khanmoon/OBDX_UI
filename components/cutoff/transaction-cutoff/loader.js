define(["module", "text!./transaction-cutoff.html", "./transaction-cutoff", "text!./transaction-cutoff.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });