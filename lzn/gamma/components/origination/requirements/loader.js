define(["module", "text!./requirements.html", "./requirements", "text!./requirements.json","text!./requirements.css","baseModel"], function (module, template, viewModel, json, css, BaseModel) {
    "use strict";
      var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
