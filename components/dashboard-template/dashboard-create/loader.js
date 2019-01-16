define(["module", "text!./dashboard-create.html", "./dashboard-create", "text!./dashboard-create.css","baseModel"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel=BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });