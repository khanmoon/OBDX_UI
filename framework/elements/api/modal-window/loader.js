define(
  ["module", "text!./modal-window.html", "./modal-window", "text!./modal-window.json", "text!./modal-window.css", "baseModel"],
  function(module, template, viewModel, metaData, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
