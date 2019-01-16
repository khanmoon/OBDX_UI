define(["module", "text!./generic-authentication.html", "./generic-authentication", "text!./generic-authentication.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });