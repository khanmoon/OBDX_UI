define(["module", "text!./payday-submission-confirmation.html", "./payday-submission-confirmation", "text!./payday-submission-confirmation.json"
    , "text!./payday-submission-confirmation.css", "baseModel"
  ],
  function(module, template, viewModel, json, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
