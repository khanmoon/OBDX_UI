define(["module", "text!./card-additional-preferences.html", "./card-additional-preferences", "text!./card-additional-preferences.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
