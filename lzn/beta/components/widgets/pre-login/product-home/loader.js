define(["module", "text!./product-home.html", "./product-home", "text!./product-home.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });