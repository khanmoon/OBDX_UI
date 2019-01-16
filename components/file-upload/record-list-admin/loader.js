define(["module", "text!./record-list-admin.html", "./record-list-admin", "text!./record-list-admin.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template:  baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
