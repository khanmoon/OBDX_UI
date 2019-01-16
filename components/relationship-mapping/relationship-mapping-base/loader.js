define(["module", "text!./relationship-mapping-base.html",
    "./relationship-mapping-base",
    "text!./relationship-mapping-base.json"
  ],
  function(module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });
