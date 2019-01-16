define(["module", "text!./funding-table.html", "./funding-table"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });