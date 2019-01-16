  define(["module", "text!./service-requests-admin-track.html", "./service-requests-admin-track", "text!./service-requests-admin-track.css", "baseModel", "text!./service-requests-admin-track.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
