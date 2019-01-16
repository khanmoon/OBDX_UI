define(["module", "text!./export-lc.html", "./export-lc", "text!./export-lc.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });