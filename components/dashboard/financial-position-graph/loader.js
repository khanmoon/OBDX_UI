define(["module", "text!./financial-position-graph.html", "./financial-position-graph", "text!./financial-position-graph.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });