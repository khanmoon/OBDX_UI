define(["module", "text!./access-point-group-create.html", "./access-point-group-create","text!./access-point-group.css","baseModel", "text!./access-point-group-create.json"], function(module, template, viewModel,css,BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
  };
});
