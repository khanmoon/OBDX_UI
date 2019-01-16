define(["module", "text!./product-groups-card.html", "./product-groups-card", "text!./product-groups-card.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });