define(["module", "text!./file-upload-view.html", "./file-upload-view", "text!./file-upload-view.css", "baseModel", "text!./file-upload-view.json"], function (module, template, viewModel, css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
