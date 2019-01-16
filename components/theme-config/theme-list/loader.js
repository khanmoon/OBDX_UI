define(["module", "text!./theme-list.html", "./theme-list", "text!./theme-list.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });