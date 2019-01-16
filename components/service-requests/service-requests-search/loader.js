define(["module", "text!./service-requests-search.html", "./service-requests-search","text!./service-requests-search.css","baseModel","text!./service-requests-search.json"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
