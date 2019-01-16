define(["module", "text!./export-bills.html", "./export-bills", "text!./export-bills.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });