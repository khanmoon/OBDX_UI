define(["module", "text!./configuration-base.html", "./configuration-base", "text!./configuration-base.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });