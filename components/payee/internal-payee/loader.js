define(["module", "text!./internal-payee.html", "./internal-payee", "text!./internal-payee.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });