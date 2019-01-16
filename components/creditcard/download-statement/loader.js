define(["module", "text!./download-statement.html", "./download-statement", "text!./download-statement.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });