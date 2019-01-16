define(["module", "text!./financial-position.html", "./financial-position", "text!./financial-position.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });