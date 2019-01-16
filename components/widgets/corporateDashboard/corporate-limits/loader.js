define(["module", "text!./corporate-limits.html", "./corporate-limits", "text!./corporate-limits.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });