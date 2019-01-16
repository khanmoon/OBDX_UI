define(["module", "text!./mapping-create.html", "./mapping-create", "text!./mapping-create.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });