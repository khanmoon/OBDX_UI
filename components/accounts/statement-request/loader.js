define(["module", "text!./statement-request.html", "./statement-request", "text!./statement-request.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });