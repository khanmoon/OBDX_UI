define(["module", "text!./review-payment-domestic.html", "./review-payment-domestic", "text!./review-payment-domestic.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });