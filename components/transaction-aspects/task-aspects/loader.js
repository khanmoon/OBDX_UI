define(["module", "text!./task-aspects.html", "./task-aspects", "text!./task-aspects.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });