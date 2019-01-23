define(["module", "text!./payment-peer-to-peer.html", "./payment-peer-to-peer", "text!./payment-peer-to-peer.json", "text!./payment-peer-to-peer.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});