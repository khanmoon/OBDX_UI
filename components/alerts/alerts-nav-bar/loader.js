define(["module", "text!./alerts-nav-bar.html", "./alerts-nav-bar", "text!./alerts-nav-bar.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });