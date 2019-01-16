define(["module", "text!./record-list-non-financial.html", "./record-list-non-financial", "text!./record-list-non-financial.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template:  baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
