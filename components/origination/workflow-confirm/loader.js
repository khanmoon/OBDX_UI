define(["module", "text!./workflow-confirm.html", "./workflow-confirm", "text!./workflow-confirm.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });