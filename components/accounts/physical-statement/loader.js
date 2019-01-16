define(["module", "text!./physical-statement.html", "./physical-statement", "text!./physical-statement.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });