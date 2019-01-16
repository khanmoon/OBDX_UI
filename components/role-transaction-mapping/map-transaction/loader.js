define(["module", "text!./map-transaction.html", "./map-transaction", "text!./map-transaction.css", "baseModel", "text!./map-transaction.json"], function (module,template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
