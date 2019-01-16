define(["module", "text!./view-bills.html", "./view-bills","text!./view-bills.css","baseModel"], function (module, template, viewModel,css, BaseModel) {
    "use strict";
     var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
