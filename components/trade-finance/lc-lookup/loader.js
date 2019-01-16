define(["module", "text!./lc-lookup.html", "./lc-lookup", "text!./lc-lookup.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });