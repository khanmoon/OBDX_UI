define(["module", "text!./debit-card-pin-request.html", "./debit-card-pin-request", "text!./debit-card-pin-request.css", "baseModel", "text!./debit-card-pin-request.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
