define(["module", "text!./profile.html", "./profile", "text!./profile.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });