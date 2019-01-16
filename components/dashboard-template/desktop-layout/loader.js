define(["module", "text!./desktop-layout.html", "./desktop-layout", "text!./desktop-layout.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });