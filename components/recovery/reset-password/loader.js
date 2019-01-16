  define(["module", "text!./reset-password.html", "./reset-password","text!./reset-password.css", "baseModel", "text!./reset-password.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";
     var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
