define(["module", "text!./workflow-admin-view.html", "./workflow-admin-view", "text!./workflow-admin-view.css", "baseModel", "text!./workflow-admin-view.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });