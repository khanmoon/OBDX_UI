define(["module", "text!./creating-transaction-blackout.html", "./creating-transaction-blackout", "text!./creating-transaction-blackout.css", "baseModel", "text!./creating-transaction-blackout.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });