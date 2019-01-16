define(["module", "text!./mapping-base.html", "./mapping-base", "text!./mapping-base.css","baseModel", "text!./mapping-base.json"], function (module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
  };
});
