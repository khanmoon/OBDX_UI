define(["module", "text!./cheque-details.html", "./cheque-details", "text!./cheque-details.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });