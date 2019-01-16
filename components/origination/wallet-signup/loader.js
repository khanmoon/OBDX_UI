define(["module", "text!./wallet-signup.html", "./wallet-signup", "text!./wallet-signup.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });