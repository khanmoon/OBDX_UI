define(["module", "text!./review-category.html", "./review-category","text!./review-category.css", "baseModel"], function (module,template,viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
