define(["module", "text!./admin-action-card.html", "./admin-action-card", "text!./admin-action-card.json",
  "text!./admin-action-card.css", "baseModel"
], function(module, template, viewModel, metaData, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
