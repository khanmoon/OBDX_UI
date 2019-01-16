define(["module", "text!./bank-look-up.html", "./bank-look-up", "text!./bank-look-up.json","text!./bank-look-up.css", "baseModel"], function (module, template, viewModel, metaData, css, BaseModel) {
    "use strict";var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
