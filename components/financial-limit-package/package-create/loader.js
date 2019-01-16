define(["module", "text!./package-create.html", "./package-create", "text!./package-create.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });