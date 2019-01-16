  define(["module", "text!./date-picker-view.html", "./date-picker-view", "text!./date-picker-view.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });