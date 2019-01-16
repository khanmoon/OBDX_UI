define(["module", "text!./demand-draft-payee.html", "./demand-draft-payee", "text!./demand-draft-payee.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });