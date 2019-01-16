define(["module", "text!./initiate-lc.html", "./initiate-lc","text!./initiate-lc.css","baseModel"], function (module, template, viewModel,css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
