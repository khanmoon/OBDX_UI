define(["module", "text!./workflow-admin-list.html", "./workflow-admin-list", "text!./workflow-admin-list.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });