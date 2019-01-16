define(["module", "text!./service-requests-form-builder.html", "./service-requests-form-builder", "text!./service-requests-form-builder.css", "baseModel", "text!./service-requests-form-builder.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
