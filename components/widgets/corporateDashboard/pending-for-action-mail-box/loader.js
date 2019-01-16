define(["module", "text!./pending-for-action-mail-box.html", "./pending-for-action-mail-box", "text!./pending-for-action-mail-box.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
