define(["module", "text!./instructions-details.html", "./instructions-details", "text!./instructions-details.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });