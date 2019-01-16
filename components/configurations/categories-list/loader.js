define(["module", "text!./categories-list.html", "./categories-list", "text!./categories-list.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });