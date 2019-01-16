define(["module", "text!./collection-instructions.html", "./collection-instructions", "text!./collection-instructions.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });