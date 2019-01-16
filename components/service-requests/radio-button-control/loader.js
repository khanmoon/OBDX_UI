define(["module", "text!./radio-button-control.html", "./radio-button-control","text!./radio-button-control.css","baseModel", "text!./radio-button-control.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
  };
});
