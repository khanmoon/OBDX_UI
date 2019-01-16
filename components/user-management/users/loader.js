define(["module", "text!./users.html", "./users", "text!./users.css", "baseModel", "text!./users.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel=BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });