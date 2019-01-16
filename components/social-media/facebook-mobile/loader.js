define(["module", "text!./facebook-mobile.html", "./facebook-mobile", "text!./facebook-mobile.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });