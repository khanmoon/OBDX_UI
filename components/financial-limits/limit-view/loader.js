define(["module", "text!./limit-view.html", "./limit-view", "text!./limit-view.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });