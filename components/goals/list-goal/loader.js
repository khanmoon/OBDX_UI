define(["module", "text!./list-goal.html", "./list-goal", "text!./list-goal.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
