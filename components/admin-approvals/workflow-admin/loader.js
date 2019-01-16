define(["module", "text!./workflow-admin.html", "./workflow-admin", "text!./workflow-admin.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });