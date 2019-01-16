define(["module", "text!./reissue-card.html", "./reissue-card", "text!./reissue-card.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
