define(["module", "text!./payment-card.html", "./payment-card", "text!./payment-card.json",
  "text!./payment-card.css", "baseModel"
], function(module, template, viewModel, metaData, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
