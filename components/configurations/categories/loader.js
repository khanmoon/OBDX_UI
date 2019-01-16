define(["module", "text!./categories.html", "./categories", "text!./categories.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });