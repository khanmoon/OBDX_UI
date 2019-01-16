  define(["module", "text!./payday-personal-details.html", "./payday-personal-details", "text!./payday-personal-details.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
