define(["module", "text!./wallet-product.html", "./wallet-product", "text!./wallet-product.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });