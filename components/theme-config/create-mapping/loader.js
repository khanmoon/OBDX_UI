define(["module", "text!./create-mapping.html", "./create-mapping", "text!./create-mapping.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });