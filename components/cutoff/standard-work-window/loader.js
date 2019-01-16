define(["module", "text!./standard-work-window.html", "./standard-work-window", "text!./standard-work-window.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });