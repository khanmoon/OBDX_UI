define(["module", "text!./view-dashboard-design.html", "./view-dashboard-design", "baseModel", "text!./view-dashboard-design.css"], function (module, template, viewModel,BaseModel,css) {
    "use strict";
    var baseModel=BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });