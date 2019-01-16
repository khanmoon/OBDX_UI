define(["module", "text!./party-access-exclusion.html", "./party-access-exclusion", "text!./party-access-exclusion.css","baseModel","text!./party-access-exclusion.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });