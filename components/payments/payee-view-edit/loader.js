define(["module", "text!./payee-view-edit.html", "./payee-view-edit", "text!./payee-view-edit.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });