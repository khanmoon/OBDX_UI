define(["module", "text!./configuration-details.html", "./configuration-details", "text!./configuration-details.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });