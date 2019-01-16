define(["module", "text!./import-bills.html", "./import-bills", "text!./import-bills.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });