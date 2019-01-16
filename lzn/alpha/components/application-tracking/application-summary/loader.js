define(["module", "text!./application-summary.html", "./application-summary"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });