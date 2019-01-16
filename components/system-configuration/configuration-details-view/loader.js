define(["module", "text!./configuration-details-view.html", "./configuration-details-view", "text!./configuration-details-view.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });