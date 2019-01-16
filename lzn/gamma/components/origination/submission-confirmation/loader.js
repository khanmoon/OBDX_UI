define(["module", "text!./submission-confirmation.html", "./submission-confirmation", "text!./submission-confirmation.json", "text!./submission-confirmation.css", "baseModel"], function(module, template, viewModel, json, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
