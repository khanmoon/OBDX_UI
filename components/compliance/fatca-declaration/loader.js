define(["module", "text!./fatca-declaration.html", "./fatca-declaration", "text!./fatca-declaration.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });
