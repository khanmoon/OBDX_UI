define(["module", "text!./review-theme.html", "./review-theme", "baseModel", "text!./review-theme.css", "text!./review-theme.json"], function (module, template, viewModel, BaseModel, css) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});