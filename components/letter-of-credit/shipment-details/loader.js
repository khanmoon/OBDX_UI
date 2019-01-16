define(["module", "text!./shipment-details.html", "./shipment-details", "text!./shipment-details.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });