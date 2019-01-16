define(["module", "text!./rest-services.html", "./rest-services", "text!./rest-services.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });