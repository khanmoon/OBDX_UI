define(["module", "text!./update-security-question-maintenance.html", "./update-security-question-maintenance", "text!./update-security-question-maintenance.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });