define(["module", "text!./account-transactions-mapping.html", "./account-transactions-mapping", "text!./account-transactions-mapping.css","baseModel","text!./account-transactions-mapping.json"], function (module, template, viewModel,css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });