define(["module", "text!./flip-account.html", "./flip-account", "text!./flip-account.json",
  "text!./flip-account.css", "baseModel"
], function(module, template, viewModel, metaData, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
