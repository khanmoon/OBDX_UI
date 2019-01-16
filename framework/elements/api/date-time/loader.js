define(["module", "text!./date-time.html", "./date-time", "text!./date-time.json", "text!./date-time.css", "baseModel"], function(module, template, viewModel, metaData, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
