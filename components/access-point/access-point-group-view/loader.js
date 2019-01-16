define(["module", "text!./access-point-group-view.html", "./access-point-group-view", "text!./access-point-group.css", "baseModel", "text!./access-point-group-view.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
