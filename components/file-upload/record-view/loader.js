define(["module", "text!./record-view.html", "./record-view", "text!./record-view.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });