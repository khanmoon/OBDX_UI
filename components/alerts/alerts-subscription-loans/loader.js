define(["module", "text!./alerts-subscription-loans.html", "./alerts-subscription-loans", "text!./alerts-subscription-loans.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });