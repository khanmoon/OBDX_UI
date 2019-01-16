define(["module","text!./wearable-instructions-next.html", "./wearable-instructions-next", "text!./wearable-instructions-next.css","baseModel"], function (module ,template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
