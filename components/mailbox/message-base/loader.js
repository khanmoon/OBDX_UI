define(["module", "text!./message-base.html", "./message-base", "text!./message-base.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });