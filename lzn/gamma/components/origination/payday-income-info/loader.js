define(["module", "text!./payday-income-info.html", "./payday-income-info", "text!./payday-income-info.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
      var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });

