define(["module",
    "text!./aggregate-register-accounts.html",
    "./aggregate-register-accounts",
    "text!./aggregate-register-accounts.css",
    "baseModel"
  ],
  function(module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
