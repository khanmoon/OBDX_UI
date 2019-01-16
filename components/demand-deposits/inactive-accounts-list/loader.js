define(["module", "text!./inactive-accounts-list.html", "./inactive-accounts-list", "text!./inactive-accounts-list.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });