define(["module", "text!./confirm-screen.html", "./confirm-screen", "text!./confirm-screen.json","text!./confirm-screen.css", "baseModel"], function (module, template, viewModel, metaData, css, BaseModel) {
    "use strict";var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
