define(["module", "text!./add-fund.html", "./add-fund", "text!./add-fund.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });