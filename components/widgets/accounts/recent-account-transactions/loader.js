define(["module", "text!./recent-account-transactions.html", "./recent-account-transactions", "text!./recent-account-transactions.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
