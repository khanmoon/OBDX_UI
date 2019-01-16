define(["module", "text!./review-relationship-mapping.html",
    "./review-relationship-mapping",
    "text!./review-relationship-mapping.json",
    "text!./review-relationship-mapping.css",
    "baseModel"
  ],
  function(module, template, viewModel, json, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
