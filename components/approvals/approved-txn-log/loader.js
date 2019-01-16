define(["module", "text!./approved-txn-log.html", "./approved-txn-log", "text!./approved-txn-log.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });