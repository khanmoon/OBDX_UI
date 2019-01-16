define(["module", "text!./user-read.html", "./user-read", "text!./user-read.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });