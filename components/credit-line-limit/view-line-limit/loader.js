define(["module", "text!./view-line-limit.html", "./view-line-limit", "text!./view-line-limit.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });