define(["module", "text!./cancellation.html", "./cancellation", "text!./cancellation.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });