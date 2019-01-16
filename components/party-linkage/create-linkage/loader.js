define(["module", "text!./create-linkage.html", "./create-linkage","text!./create-linkage.css","baseModel", "text!./create-linkage.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
      var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
