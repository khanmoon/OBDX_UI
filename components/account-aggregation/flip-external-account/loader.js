define(["module", "text!./flip-external-account.html", "./flip-external-account", "text!./flip-external-account.json",
  "text!./flip-external-account.css", "baseModel"
], function(module, template, viewModel, metaData, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
