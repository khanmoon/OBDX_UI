define(["module", "text!./goals-dashboard-card.html", "./goals-dashboard-card", "text!./goals-dashboard-card.css","baseModel"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
