define(["module", "text!./confirm-pattern.html", "./confirm-pattern","text!./confirm-pattern.css","baseModel"], function (module, template, viewModel,css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
