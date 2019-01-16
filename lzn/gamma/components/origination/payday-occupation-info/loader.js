define(["module", "text!./payday-occupation-info.html", "./payday-occupation-info","text!./payday-occupation-info.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
      var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
