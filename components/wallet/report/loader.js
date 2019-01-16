define(["module", "text!./report.html", "./report", "text!./report.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });