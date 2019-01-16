define(["module", "text!./application-role-read.html", "./application-role-read", "text!./application-role-read.css", "baseModel", "text!./application-role-read.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
