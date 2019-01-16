define(["module", "text!./td-open.html", "./td-open", "text!./td-open.css", "baseModel", "text!./td-open.json"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
