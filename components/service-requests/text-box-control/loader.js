define(["module", "text!./text-box-control.html", "./text-box-control", "text!./text-box-control.css","baseModel", "text!./text-box-control.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
  };
});
