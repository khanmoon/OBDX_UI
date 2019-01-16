define(["module", "text!./security-code-verification.html", "./security-code-verification", "text!./security-code-verification.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });