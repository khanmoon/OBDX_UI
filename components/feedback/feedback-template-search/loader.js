define(["module", "text!./feedback-template-search.html", "./feedback-template-search","text!./feedback-template-search.css", "baseModel"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
      var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
