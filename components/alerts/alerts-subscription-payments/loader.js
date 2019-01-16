define(["module", "text!./alerts-subscription-payments.html", "./alerts-subscription-payments", "text!./alerts-subscription-payments.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });