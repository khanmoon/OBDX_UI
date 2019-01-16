define(["module", "text!./alerts-td.html", "./alerts-td", "text!./alerts-td.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });