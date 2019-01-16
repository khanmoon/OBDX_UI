define(["module", "text!./collection-filters.html", "./collection-filters", "text!./collection-filters.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });