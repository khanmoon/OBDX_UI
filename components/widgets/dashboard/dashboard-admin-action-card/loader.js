define(["module", "text!./dashboard-admin-action-card.html", "./dashboard-admin-action-card", "text!./dashboard-admin-action-card.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
