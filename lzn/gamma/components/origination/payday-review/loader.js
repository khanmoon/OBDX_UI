define(["module", "text!./payday-review.html", "./payday-review", "text!./payday-review.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
