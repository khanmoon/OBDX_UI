define(["module", "text!./occupation-info.html", "./occupation-info", "text!./occupation-info.json","text!./occupation-info.css","baseModel"], function (module, template, viewModel, json, css, BaseModel) {
    "use strict";
      var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
