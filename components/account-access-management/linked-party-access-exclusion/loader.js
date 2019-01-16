define(["module", "text!./linked-party-access-exclusion.html", "./linked-party-access-exclusion", "text!./linked-party-access-exclusion.css","baseModel","text!./linked-party-access-exclusion.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });