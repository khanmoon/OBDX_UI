define(["module", "text!./approved-log.html", "./approved-log", "text!./approved-log.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });