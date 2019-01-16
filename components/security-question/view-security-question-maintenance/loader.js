define(["module", "text!./view-security-question-maintenance.html", "./view-security-question-maintenance", "text!./view-security-question-maintenance.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
