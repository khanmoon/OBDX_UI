define(["module", "text!./corporate-activity-log.html", "./corporate-activity-log", "text!./corporate-activity-log.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });