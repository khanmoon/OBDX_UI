define(["module",
    "text!./link-account.html",
    "./link-account",
    "text!./link-account.css",
    "baseModel",
    "text!./link-account.json"
  ],
  function(module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
