define(["module", "text!./scan-to-pay.html", "./scan-to-pay", "text!./scan-to-pay.json", "text!./scan-to-pay.css","baseModel"], function (module, template, viewModel, css,BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});