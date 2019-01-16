define(["module", "text!./file-approval.html", "./file-approval", "text!./file-approval.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });