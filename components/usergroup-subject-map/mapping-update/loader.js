define(["module", "text!./mapping-update.html", "./mapping-update", "text!./mapping-update.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });