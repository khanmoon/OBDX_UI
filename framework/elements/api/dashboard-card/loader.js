define(["module", "text!./dashboard-card.html", "./dashboard-card", "text!./dashboard-card.json",
  "text!./dashboard-card.css", "baseModel"
], function(module, template, viewModel, metaData, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
