define(["module", "text!./date-box.html", "./date-box", "text!./date-box.json", "text!./date-box.css", "baseModel"], function(module, template, viewModel, metaData, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
