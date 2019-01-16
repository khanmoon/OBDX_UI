define(["module", "text!./alert-detail.html", "./alert-detail", "text!./alert-detail.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });