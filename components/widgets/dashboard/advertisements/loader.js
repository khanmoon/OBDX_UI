define(["module", "text!./advertisements.html", "./advertisements", "text!./advertisements.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });