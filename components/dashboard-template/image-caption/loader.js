define(["module", "text!./image-caption.html", "./image-caption", "text!./image-caption.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });