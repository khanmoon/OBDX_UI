define(["module", "text!./workflow-list.html", "./workflow-list", "text!./workflow-list.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });