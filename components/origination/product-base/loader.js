define(["module", "text!./product-base.html", "./product-base", "text!./product-base.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });