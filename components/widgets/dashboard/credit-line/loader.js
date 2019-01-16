define(["module", "text!./credit-line.html", "./credit-line", "text!./credit-line.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });