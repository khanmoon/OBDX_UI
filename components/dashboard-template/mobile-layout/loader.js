define(["module", "text!./mobile-layout.html", "./mobile-layout", "text!./mobile-layout.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });