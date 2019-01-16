define(["module", "text!./payment-peer-to-peer.html", "./payment-peer-to-peer", "text!./payment-peer-to-peer.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });