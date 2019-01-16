define(["module", "text!./add-ext-bank-review.html", "./add-ext-bank-review", "text!./add-ext-bank-review.json","text!./add-ext-bank-review.css", "baseModel"], function (module, template, viewModel,json,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
