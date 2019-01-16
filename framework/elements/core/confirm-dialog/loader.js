define(["module", "text!./confirm-dialog.html", "./confirm-dialog", "text!./confirm-dialog.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });