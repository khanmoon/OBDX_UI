  define(["module", "text!./drop-list-view.html", "./drop-list-view", "text!./drop-list-view.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });