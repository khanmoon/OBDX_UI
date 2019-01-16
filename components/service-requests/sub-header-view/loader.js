define(["module", "text!./sub-header-view.html", "./sub-header-view", "text!./sub-header-view.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });
