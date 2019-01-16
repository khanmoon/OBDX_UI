define(["module", "text!./debit-card-limits.html", "./debit-card-limits", "text!./debit-card-limits.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });