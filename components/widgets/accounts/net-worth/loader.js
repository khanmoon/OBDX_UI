define(["module", "text!./net-worth.html", "./net-worth", "text!./net-worth.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });