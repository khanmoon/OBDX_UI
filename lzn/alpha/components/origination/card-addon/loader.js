define(["module", "text!./card-addon.html", "./card-addon"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });