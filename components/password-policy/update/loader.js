define(["module", "text!./update.html", "./update", "text!./update.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });