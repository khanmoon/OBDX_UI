define(["module", "text!./identity-info.html", "./identity-info", "text!./identity-info.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });