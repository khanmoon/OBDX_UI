define(["module", "text!./initiate-guarantee.html", "./initiate-guarantee", "text!./initiate-guarantee.css", "baseModel", "text!./initiate-guarantee.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
