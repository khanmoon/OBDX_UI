define(["module", "text!./rules.html", "./rules", "text!./rules.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });