define(["module", "text!./list-card.html", "./list-card", "text!./list-card.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });