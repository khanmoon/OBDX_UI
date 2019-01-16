define(["module", "text!./sms-banking-edit.html", "./sms-banking-edit", "text!./sms-banking-edit.css","baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
  };
});
