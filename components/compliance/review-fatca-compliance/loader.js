define(["module", "text!./review-fatca-compliance.html", "./review-fatca-compliance", "text!./review-fatca-compliance.css", "baseModel", "text!./review-fatca-compliance.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
