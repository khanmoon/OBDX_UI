define(["module", "text!./app-tracker-summary.html", "./app-tracker-summary", "text!./app-tracker-summary.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });