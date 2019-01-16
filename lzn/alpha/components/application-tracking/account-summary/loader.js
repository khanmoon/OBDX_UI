define(["module", "text!./account-summary.html", "./account-summary"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });