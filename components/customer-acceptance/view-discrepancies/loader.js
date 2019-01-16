define(["module", "text!./view-discrepancies.html", "./view-discrepancies","text!./view-discrepancies.css","baseModel", "text!./view-discrepancies.json"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
