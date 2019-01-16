define(["module", "text!./action-card.html", "./action-card", "text!./action-card.json",
  "text!./action-card.css", "baseModel"
], function(module, template, viewModel, metaData, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
