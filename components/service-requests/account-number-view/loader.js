  define(["module", "text!./account-number-view.html", "./account-number-view", "text!./account-number-view.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });