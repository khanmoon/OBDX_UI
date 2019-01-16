define(["module", "text!./requirements.html", "./requirements"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });