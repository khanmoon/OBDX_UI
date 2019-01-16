define(["module", "text!./floating-panel.html", "./floating-panel", "text!./floating-panel.json", "text!./floating-panel.css", "baseModel"], function(module, template, viewModel, metaData, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
