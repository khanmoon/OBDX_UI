define(["module", "text!./file-identifier-search.html", "./file-identifier-search", "text!./file-identifier-search.css", "baseModel", "text!./file-identifier-search.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel=BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
