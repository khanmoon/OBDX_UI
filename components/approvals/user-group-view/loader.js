define(["module", "text!./user-group-view.html", "./user-group-view", "text!./user-group-view.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });