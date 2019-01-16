define(["module", "text!./application-dashboard.html", "./application-dashboard"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });