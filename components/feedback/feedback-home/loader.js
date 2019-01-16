define(["module", "text!./feedback-home.html", "./feedback-home", "text!./feedback-home.css","baseModel", "text!./feedback-home.json"],
function (module, template, viewModel, css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
