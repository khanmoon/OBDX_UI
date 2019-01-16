define(["module", "text!./record-listing.html", "./record-listing", "text!./record-listing.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });