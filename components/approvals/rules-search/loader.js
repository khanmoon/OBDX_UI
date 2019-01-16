define(["module", "text!./rules-search.html", "./rules-search", "text!./rules-search.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });