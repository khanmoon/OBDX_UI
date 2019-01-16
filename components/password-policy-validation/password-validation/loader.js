define(["module", "text!./password-validation.html", "./password-validation", "text!./password-validation.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });