define(["module", "text!./location-update.html", "./location-update", "text!./location-update.css", "baseModel","text!./location-update.json"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
