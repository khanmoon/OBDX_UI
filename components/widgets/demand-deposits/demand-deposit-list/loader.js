define(["module", "text!./demand-deposit-list.html", "./demand-deposit-list", "text!./demand-deposit-list.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });