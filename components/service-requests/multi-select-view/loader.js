  define(["module", "text!./multi-select-view.html", "./multi-select-view", "text!./multi-select-view.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });