define(["module", "text!./user-creation.html", "./user-creation", "text!./user-creation.json","text!./user-creation.css","baseModel"], function (module, template, viewModel, json, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
