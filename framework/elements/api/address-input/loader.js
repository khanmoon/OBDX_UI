define(["module", "text!./address-input.html", "./address-input", "text!./address-input.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });