define(["module", "text!./user-information.html", "./user-information", "text!./user-information.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });