define(["module", "text!./template-list.html", "./template-list", "text!./template-list.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });