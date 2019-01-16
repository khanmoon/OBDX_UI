define(["module", "text!./preference-base.html", "./preference-base", "text!./preference-base.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });