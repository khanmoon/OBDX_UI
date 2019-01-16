define(["module",
    "text!./link-customer-account.html",
    "./link-customer-account",
    "text!./link-customer-account.css",
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
