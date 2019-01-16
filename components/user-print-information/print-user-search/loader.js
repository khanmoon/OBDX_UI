define(["module", "text!./print-user-search.html", "./print-user-search", "text!./print-user-search.css", "baseModel", "text!./print-user-search.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
