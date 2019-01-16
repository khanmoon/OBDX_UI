define(["module", "text!./audit-log-results.html", "./audit-log-results", "text!./audit-log-results.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });