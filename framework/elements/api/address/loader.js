define(["module", "text!./address.html", "./address", "text!./address.json", "text!./address.css", "baseModel"],
  function(module, template, viewModel, metaData, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
