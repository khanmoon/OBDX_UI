  define(["module", "text!./gender-view.html", "./gender-view", "text!./gender-view.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });