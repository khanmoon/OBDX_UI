define(["module", "text!./payment-internal.html", "./payment-internal", "text!./payment-internal.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });