define(["module", "text!./linkage-base.html", "./linkage-base","text!./linkage-base.css","baseModel", "text!./linkage-base.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
        template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
