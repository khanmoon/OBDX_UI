define(["module", "text!./read.html", "./read","text!./policy-read.css", "baseModel", "text!./read.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
