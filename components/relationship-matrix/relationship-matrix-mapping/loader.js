define(["module",
  "text!./relationship-matrix-mapping.html",
  "./relationship-matrix-mapping",
  "text!./relationship-matrix-mapping.json",
  "text!./relationship-matrix-mapping.css",
  "baseModel"
], function(module, template, viewModel, json, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
