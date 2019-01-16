define(["module", "text!./review-application-role-create.html", "./review-application-role-create", "text!./review-application-role-create.css", "baseModel", "text!./review-application-role-create.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
     var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });