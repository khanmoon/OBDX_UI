define(["module", "text!./view-qr-code.html", "./view-qr-code", "text!./view-qr-code.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });