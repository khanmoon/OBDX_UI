define(["module", "text!./location-create.html", "./location-create", "text!./location-create.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });