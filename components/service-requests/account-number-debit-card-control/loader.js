define(["module", "text!./account-number-debit-card-control.html", "./account-number-debit-card-control", "text!./account-number-debit-card-control.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
