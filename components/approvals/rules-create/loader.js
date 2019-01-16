define(["module", "text!./rules-create.html", "./rules-create", "text!./rules-create.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });