define(["module", "text!./review-sweep-in-instruction.html", "./review-sweep-in-instruction", "text!./review-sweep-in-instruction.json", "text!./review-sweep-in-instruction.css", "baseModel"], function(module, template, viewModel, json, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))

  };
});
