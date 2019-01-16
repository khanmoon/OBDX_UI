define(["module", "text!./sms-primary-account.html", "./sms-primary-account", "text!./sms-primary-account.css","baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
  };
});
