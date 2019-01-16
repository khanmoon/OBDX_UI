define(["module", "text!./menu.html", "./menu", "text!./menu.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });