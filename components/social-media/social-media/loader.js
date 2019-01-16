define(["module", "text!./social-media.html", "./social-media", "text!./social-media.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });