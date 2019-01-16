define(["module", "text!./review-amend-lc.html", "./review-amend-lc","text!./review-amend-lc.css","baseModel"], function (module, template, viewModel,css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
