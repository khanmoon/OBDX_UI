define(["module", "text!./user-segments-product-list.html", "./user-segments-product-list", "text!./user-segments-product-list.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
