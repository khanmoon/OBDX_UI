define(["module", "text!./virtual-keyboard.html", "./virtual-keyboard", "text!./virtual-keyboard.json",
  "text!./virtual-keyboard.css", "baseModel"
], function(module, template, viewModel, metaData, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
