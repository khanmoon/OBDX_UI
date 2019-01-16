define(["module", "text!./otp-verification.html", "./otp-verification", "text!./otp-verification.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });