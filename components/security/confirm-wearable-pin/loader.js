define(["module","text!./confirm-wearable-pin.html", "./confirm-wearable-pin", "text!./confirm-wearable-pin.css","baseModel"], function (module ,template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
