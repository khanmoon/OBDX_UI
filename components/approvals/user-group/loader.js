define(["module", "text!./user-group.html", "./user-group", "text!./user-group.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });