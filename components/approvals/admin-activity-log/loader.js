define(["module", "text!./admin-activity-log.html", "./admin-activity-log", "text!./admin-activity-log.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });