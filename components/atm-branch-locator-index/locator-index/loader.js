define(["module", "text!./locator-index.html", "./locator-index", "text!./locator-index.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });