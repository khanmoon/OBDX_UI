define(["module", "text!./income-info.html", "./income-info", "text!./income-info.json", "text!./income-info.css","baseModel"], function (module, template, viewModel, json, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
   return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
