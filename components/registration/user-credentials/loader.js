define(["module", "text!./user-credentials.html", "./user-credentials", "text!./user-credentials.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });