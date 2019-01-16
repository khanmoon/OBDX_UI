define(["module", "text!./mapping-search.html", "./mapping-search", "text!./mapping-search.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });