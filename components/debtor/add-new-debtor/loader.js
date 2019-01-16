define(["module", "text!./add-new-debtor.html", "./add-new-debtor", "text!./add-new-debtor.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });