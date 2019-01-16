define(["module", "text!./workflow.html", "./workflow", "text!./workflow.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });