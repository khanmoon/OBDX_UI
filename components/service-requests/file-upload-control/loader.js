define(["module", "text!./file-upload-control.html", "./file-upload-control", "text!./file-upload-control.css","baseModel", "text!./file-upload-control.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
  };
});
