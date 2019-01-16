define(["module", "text!./user-creation.html", "./user-creation","text!./user-creation.css","baseModel", "text!./user-creation.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
     var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
     template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });