define(["module", "text!./create-relationship-mapping.html",
    "./create-relationship-mapping",
    "text!./create-relationship-mapping.json",
    "text!./create-relationship-mapping.css",
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
