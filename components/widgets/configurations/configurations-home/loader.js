define(["module", "text!./configurations-home.html", "./configurations-home", "text!./configurations-home.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });