define(["module", "text!./wallets-opened-report.html", "./wallets-opened-report", "text!./wallets-opened-report.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });