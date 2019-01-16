define(["module", "text!./orientation.html", "./orientation", "text!./orientation.json","text!./orientation.css","baseModel"], function (module, template, viewModel, json, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
  return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
