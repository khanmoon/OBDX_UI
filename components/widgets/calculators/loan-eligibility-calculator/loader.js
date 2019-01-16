define(["module", "text!./loan-eligibility-calculator.html", "./loan-eligibility-calculator", "text!./loan-eligibility-calculator.css","baseModel"], function (module, retTemplate, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(retTemplate, css, baseModel.getComponentName(module))
    };
  });
