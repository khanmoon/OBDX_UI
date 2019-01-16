define(["module", "text!./demand-deposit-service-request.html", "./demand-deposit-service-request", "text!./demand-deposit-service-request.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
