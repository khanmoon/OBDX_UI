define(["module", "text!./search-list.html", "./search-list", "text!./search-list.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });