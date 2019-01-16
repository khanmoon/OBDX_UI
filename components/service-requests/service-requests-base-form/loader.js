define(["module", "text!./service-requests-base-form.html", "./service-requests-base-form","text!./service-requests-base-form.css","baseModel","text!./service-requests-base-form.json"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
