define(["module", "text!./mailers-base.html", "./mailers-base", "text!./mailers-base.css","baseModel","text!./mailers-base.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
