define(["module", "text!./color-picker.html", "./color-picker", "text!./color-picker.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });