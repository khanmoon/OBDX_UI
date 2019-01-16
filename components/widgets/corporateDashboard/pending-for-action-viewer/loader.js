define(["module", "text!./pending-for-action-viewer.html", "./pending-for-action-viewer", "text!./pending-for-action-viewer.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
