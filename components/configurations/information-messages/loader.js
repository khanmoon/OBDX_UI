define(["module", "text!./information-messages.html", "./information-messages", "text!./information-messages.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });