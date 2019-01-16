define(["module", "text!./sweep-in-instruction.html", "./sweep-in-instruction", "text!./sweep-in-instruction.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))

  };
});
