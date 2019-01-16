define(["module",
    "text!./service-advisors.html",
    "./service-advisors",
    "text!./service-advisors.css",
    "baseModel",
    "text!./service-advisors.json"
  ],
  function(module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
