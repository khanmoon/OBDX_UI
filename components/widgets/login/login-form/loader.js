define(["module", "text!./login-form.html", "./login-form", "text!./login-form.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });