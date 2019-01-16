define(["module", "text!./action-header.html", "./action-header", "text!./action-header.json", "text!./action-header.css", "baseModel"], function(module, template, viewModel, metaData, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
