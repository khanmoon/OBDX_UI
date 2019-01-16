define(["module", "text!./debtor-money-request.html", "./debtor-money-request", "text!./debtor-money-request.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
