define(["module", "text!./create.html", "./create", "text!./create.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });