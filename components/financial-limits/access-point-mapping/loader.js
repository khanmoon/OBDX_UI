define(["module", "text!./access-point-mapping.html", "./access-point-mapping", "text!./access-point-mapping.css", "baseModel", "text!./access-point-mapping.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
