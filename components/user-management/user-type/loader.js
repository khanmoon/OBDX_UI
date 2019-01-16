define(["module", "text!./user-type.html", "./user-type", "text!./user-type.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });