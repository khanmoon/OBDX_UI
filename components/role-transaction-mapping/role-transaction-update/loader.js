define(["module", "text!./role-transaction-update.html", "./role-transaction-update", "text!./role-transaction-update.css", "baseModel", "text!./role-transaction-update.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
