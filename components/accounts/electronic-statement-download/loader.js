define(["module", "text!./electronic-statement-download.html", "./electronic-statement-download","text!./electronic-statement-download.css", "baseModel","text!./electronic-statement-download.json"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });