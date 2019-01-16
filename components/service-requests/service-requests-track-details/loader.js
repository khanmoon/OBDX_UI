  define(["module", "text!./service-requests-track-details.html", "./service-requests-track-details", "text!./service-requests-track-details.css", "baseModel", "text!./service-requests-track-details.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
