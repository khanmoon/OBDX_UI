define(["module", "text!./discrepancies.html", "./discrepancies", "text!./discrepancies.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });