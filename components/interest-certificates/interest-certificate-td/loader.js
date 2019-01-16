define(["module", "text!./interest-certificate-td.html", "./interest-certificate-td", "text!./interest-certificate-td.css", "baseModel", "text!./interest-certificate-td.json"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
