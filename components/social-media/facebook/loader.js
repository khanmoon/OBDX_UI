define(["module", "text!./facebook.html", "./facebook", "text!./facebook.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });