define(["module", "text!./unclaimed-funds.html", "./unclaimed-funds", "text!./unclaimed-funds.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });