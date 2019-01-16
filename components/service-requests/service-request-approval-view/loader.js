define(["module", "text!./service-request-approval-view.html", "./service-request-approval-view", "text!./service-request-approval-view.css", "baseModel", "text!./service-request-approval-view.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
