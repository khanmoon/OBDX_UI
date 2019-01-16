define(["module", "text!./card-statement.html", "./card-statement", "text!./card-statement.css", "baseModel", "text!./card-statement.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
