define(["module", "text!./add-biller-main.html", "./add-biller-main", "text!./add-biller-main.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });