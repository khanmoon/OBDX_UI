define(["module", "text!./search-results.html", "./search-results", "text!./search-results.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });