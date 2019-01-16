define(["module", "text!./transaction-blackout.html", "./transaction-blackout", "text!./transaction-blackout.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });