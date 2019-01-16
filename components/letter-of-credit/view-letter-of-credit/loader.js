define(["module", "text!./view-letter-of-credit.html", "./view-letter-of-credit","text!./view-letter-of-credit.css","baseModel"], function (module, template, viewModel,css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
