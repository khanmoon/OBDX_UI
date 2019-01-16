define(["module", "text!./users-update.html", "./users-update", "text!./users-update.css", "baseModel", "text!./users-update.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel=BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
