define(["module", "text!./manage-accounts.html", "./manage-accounts", "text!./manage-accounts.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });