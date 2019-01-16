define(["module", "text!./review-role-transaction-update.html", "./review-role-transaction-update", "text!./review-role-transaction-update.css", "baseModel", "text!./review-role-transaction-update.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
     var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });