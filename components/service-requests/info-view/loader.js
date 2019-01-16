define(["module", "text!./info-view.html", "./info-view", "text!./info-view.css","baseModel","text!./info-view.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
  };
});
