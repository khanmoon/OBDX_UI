define(["module", "text!./payee-restrictions-landing.html", "./payee-restrictions-landing", "text!./payee-restriction-landing.css", "baseModel"], function (module, template, viewModel, css, BaseModel ) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });