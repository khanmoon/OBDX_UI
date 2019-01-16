define(["module", "text!./account-type-dialog.html", "./account-type-dialog", "text!./account-type-dialog.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template:  baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
