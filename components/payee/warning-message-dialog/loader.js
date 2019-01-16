define(["module", "text!./warning-message-dialog.html", "./warning-message-dialog", "text!./warning-message-dialog.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });