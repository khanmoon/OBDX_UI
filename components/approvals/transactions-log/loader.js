define(["module", "text!./transactions-log.html", "./transactions-log", "text!./transactions-log.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });