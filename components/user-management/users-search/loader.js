define(["module", "text!./users-search.html", "./users-search", "text!./users-search.css", "baseModel", "text!./users-search.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel=BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
