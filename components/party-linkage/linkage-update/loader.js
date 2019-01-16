define(["module", "text!./linkage-update.html", "./linkage-update","text!./linkage-update.css","baseModel", "text!./linkage-update.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
      var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
