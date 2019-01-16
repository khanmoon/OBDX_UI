define(["module", "text!./scan-qr.html", "./scan-qr", "text!./scan-qr.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });