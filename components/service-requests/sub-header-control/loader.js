define(["module", "text!./sub-header-control.html", "./sub-header-control", "text!./sub-header-control.css", "baseModel", "text!./sub-header-control.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
