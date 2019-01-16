define(["module", "text!./collection-nav-bar.html", "./collection-nav-bar", "text!./collection-nav-bar.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });