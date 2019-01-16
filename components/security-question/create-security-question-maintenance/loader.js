define(["module", "text!./create-security-question-maintenance.html", "./create-security-question-maintenance", "text!./create-security-question-maintenance.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
