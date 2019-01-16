define(["module", "text!./file-history.html", "./file-history", "text!./file-history.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });