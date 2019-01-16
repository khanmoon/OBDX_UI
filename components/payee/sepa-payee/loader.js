define(["module", "text!./sepa-payee.html", "./sepa-payee", "text!./sepa-payee.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });