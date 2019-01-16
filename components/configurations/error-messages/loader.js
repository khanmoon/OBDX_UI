define(["module", "text!./error-messages.html", "./error-messages", "text!./error-messages.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });