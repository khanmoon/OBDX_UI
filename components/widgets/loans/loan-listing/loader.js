define(["module", "text!./loan-listing.html", "./loan-listing", "text!./loan-listing.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });