define(["module", "text!./personal-details.html", "./personal-details", "text!./personal-details.json", "text!./personal-details.css", "baseModel"], function(module, template, viewModel, json, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
