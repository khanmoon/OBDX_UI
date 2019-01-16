define(["module", "text!./dashboard.html", "./dashboard", "text!./dashboard.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });