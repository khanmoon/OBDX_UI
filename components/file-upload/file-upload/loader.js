define(["module", "text!./file-upload.html", "./file-upload", "text!./file-upload.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });