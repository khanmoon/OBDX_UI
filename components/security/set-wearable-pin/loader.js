define(["module","text!./set-wearable-pin.html", "./set-wearable-pin", "text!./set-wearable-pin.css","baseModel"], function (module ,template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
