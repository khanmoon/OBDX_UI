define(["module", "text!./payment-new-recipient.html", "./payment-new-recipient", "text!./payment-new-recipient.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });