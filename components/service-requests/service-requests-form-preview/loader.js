define(["module", "text!./service-requests-form-preview.html", "./service-requests-form-preview", "text!./service-requests-form-preview.css","baseModel","text!./service-requests-form-preview.json"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
