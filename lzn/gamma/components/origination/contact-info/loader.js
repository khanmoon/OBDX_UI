define(["module", "text!./contact-info.html", "./contact-info", "text!./contact-info.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });