define(["module", "text!./alerts-list.html", "./alerts-list", "text!./alerts-list.json",
  "text!./alerts-list.css", "baseModel"],
function (module, template, viewModel, metaData, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
