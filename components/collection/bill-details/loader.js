define(["module", "text!./bill-details.html", "./bill-details", "text!./bill-details.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });