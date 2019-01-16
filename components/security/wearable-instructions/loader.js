define(["module", "text!./wearable-instructions.html", "./wearable-instructions", "text!./wearable-instructions.css","baseModel"], function (module ,template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
