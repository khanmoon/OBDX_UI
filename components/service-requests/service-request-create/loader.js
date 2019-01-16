  define(["module", "text!./service-request-create.html", "./service-request-create", "text!./service-request-create.css", "baseModel", "text!./service-request-create.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
