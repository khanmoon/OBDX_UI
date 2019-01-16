define(["module", "text!./file-identifier-create.html", "./file-identifier-create", "text!./file-identifier-create.css", "baseModel", "text!./file-identifier-create.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel=BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
