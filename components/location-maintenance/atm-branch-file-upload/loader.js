define(["module", "text!./atm-branch-file-upload.html", "./atm-branch-file-upload", "text!./atm-branch-file-upload.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
