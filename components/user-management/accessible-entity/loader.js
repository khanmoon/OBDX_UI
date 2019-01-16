define(["module", "text!./accessible-entity.html", "./accessible-entity", "text!./accessible-entity.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });