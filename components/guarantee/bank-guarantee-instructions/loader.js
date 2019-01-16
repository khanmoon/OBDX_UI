define(["module", "text!./bank-guarantee-instructions.html", "./bank-guarantee-instructions", "text!./bank-guarantee-instructions.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });