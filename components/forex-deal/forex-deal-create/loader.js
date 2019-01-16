define(["module", "text!./forex-deal-create.html", "./forex-deal-create", "text!./forex-deal-create.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
