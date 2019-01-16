define(["module", "text!./rules-admin.html", "./rules-admin", "text!./rules-admin.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });