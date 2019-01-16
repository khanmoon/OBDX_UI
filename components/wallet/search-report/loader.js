define(["module", "text!./search-report.html", "./search-report", "text!./search-report.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });