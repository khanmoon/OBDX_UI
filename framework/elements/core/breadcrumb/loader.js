define(["module", "text!./breadcrumb.html", "./breadcrumb", "text!./breadcrumb.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });