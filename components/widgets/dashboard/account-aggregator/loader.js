define(["module",
    "text!./account-aggregator.html",
    "./account-aggregator",
    "text!./account-aggregator.css",
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
