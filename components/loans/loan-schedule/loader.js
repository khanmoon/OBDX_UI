define(["module", "text!./loan-schedule.html", "./loan-schedule", "text!./loan-schedule.css", "baseModel", "text!./loan-schedule.json"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
