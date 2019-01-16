define(["module", "text!./td-payout.html", "./td-payout", "text!./td-payout.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });