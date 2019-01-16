define(["module", "text!./mapping-modules.html", "./mapping-modules", "text!./mapping-modules.css","baseModel","text!./mapping-modules.json"], function (module, template, viewModel,css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
     template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });