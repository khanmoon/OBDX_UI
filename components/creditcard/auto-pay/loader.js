define(["module", "text!./auto-pay.html", "./auto-pay", "text!./auto-pay.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });