define(["module", "text!./bank-promotional-offers.html", "./bank-promotional-offers", "text!./bank-promotional-offers.css","baseModel"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
