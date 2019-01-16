define(["module", "text!./message-nav-bar.html", "./message-nav-bar", "text!./message-nav-bar.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });