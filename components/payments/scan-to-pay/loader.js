define(["module", "text!./scan-to-pay.html", "./scan-to-pay", "text!./scan-to-pay.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });