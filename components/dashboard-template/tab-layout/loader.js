define(["module", "text!./tab-layout.html", "./tab-layout", "text!./tab-layout.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });