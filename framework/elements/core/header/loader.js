define(["module", "text!./header.html", "./header", "text!./header.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });