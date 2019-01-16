define(["module", "text!./draft-list.html", "./draft-list", "text!./draft-list.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });