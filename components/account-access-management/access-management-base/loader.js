define(["module", "text!./access-management-base.html", "./access-management-base", "text!./access-management-base.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });