define(["module", "text!./session-summary.html", "./session-summary", "text!./session-summary.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });