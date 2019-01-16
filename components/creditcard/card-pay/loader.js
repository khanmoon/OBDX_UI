define(["module", "text!./card-pay.html", "./card-pay", "text!./card-pay.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });