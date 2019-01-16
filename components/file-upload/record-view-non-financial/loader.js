define(["module", "text!./record-view-non-financial.html", "./record-view-non-financial", "text!./record-view-non-financial.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });