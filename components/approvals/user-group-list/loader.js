define(["module", "text!./user-group-list.html", "./user-group-list", "text!./user-group-list.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });