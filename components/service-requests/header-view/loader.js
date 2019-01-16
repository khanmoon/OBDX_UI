define(["module", "text!./header-view.html", "./header-view", "text!./header-view.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });
