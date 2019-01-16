define(["module", "text!./service-requests-base-main.html", "./service-requests-base-main", "text!./service-requests-base-main.css","baseModel","text!./service-requests-base-main.json"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
