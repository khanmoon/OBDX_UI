define(["module", "text!./add-on-card.html", "./add-on-card", "text!./add-on-card.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });