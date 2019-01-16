define(["module", "text!./activity-log.html", "./activity-log", "text!./activity-log.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });