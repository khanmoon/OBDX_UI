define(["module", "text!./work-box.html", "./work-box", "text!./work-box.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });