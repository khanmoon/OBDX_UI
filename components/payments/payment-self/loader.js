define(["module", "text!./payment-self.html", "./payment-self", "text!./payment-self.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });