define(["module", "text!./sms-banking-review.html", "./sms-banking-review", "text!./sms-banking-review.css","baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
  };
});


