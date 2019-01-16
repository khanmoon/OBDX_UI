define(["module", "text!./docked-menu.html", "./docked-menu", "text!./docked-menu.json",
  "text!./docked-menu.css", "baseModel"
], function(module, template, viewModel, metaData, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
