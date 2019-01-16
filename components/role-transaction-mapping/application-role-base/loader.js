define(["module", "text!./application-roles.html", "./application-roles", "text!./application-role-base.css", "baseModel", "text!./application-roles.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
