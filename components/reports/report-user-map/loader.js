define(["module", "text!./report-user-map.html", "./report-user-map", "text!./report-user-map.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });