define(["module", "text!./biller-category-landing.html", "./biller-category-landing","text!./biller-category-landing.css", "baseModel"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
      var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });