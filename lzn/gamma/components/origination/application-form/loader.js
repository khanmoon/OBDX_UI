define(["module", "text!./application-form.html", "./application-form", "text!./application-form.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });