define(["module", "text!./quick-links.html", "./quick-links", "text!./quick-links.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });