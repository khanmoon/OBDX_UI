define(["module", "text!./review-linked-party-access-management.html", "./review-linked-party-access-management", "text!./review-linked-party-access-management.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
