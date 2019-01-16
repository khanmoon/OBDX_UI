define(["module", "text!./budgets-dashboard-card.html", "./budgets-dashboard-card", "text!./budgets-dashboard-card.css","baseModel"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
