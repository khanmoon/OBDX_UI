define(["module", "text!./statement-card.html", "./statement-card", "text!./statement-card.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });