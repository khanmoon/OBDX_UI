define(["module", "text!./list-collection.html", "./list-collection", "text!./list-collection.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });